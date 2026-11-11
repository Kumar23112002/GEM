import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { colors } from '../../theme/colors';

const STATUS_BADGE = {
  accepted: { bg: '#dcfce7', color: '#15803d', border: '#86efac', label: '✓ ACCEPTED' },
  rejected: { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', label: '✕ REJECTED' },
  active: { bg: '#fef3c7', color: '#b45309', border: '#fde68a', label: '● ACTIVE' },
};

function normalizeAmount(raw) {
  if (!raw) return '';
  const trimmed = String(raw).trim().replace(/^\?+/, '₹');
  return /^\d/.test(trimmed) ? `₹${trimmed}` : trimmed;
}

function isMessageFromRole(msg, isBuyer) {
  return isBuyer
    ? msg.from === 'me' || msg.from === 'buyer'
    : msg.from === 'me' || msg.from === 'seller';
}

/**
 * Shared OLX-style live B2B trade negotiation room.
 * Counter / Accept / Reject controls render inline directly beneath the
 * counterparty's latest offer bubble, keeping the bottom composer clean.
 */
export default function NegotiationWorkspace({
  role = 'buyer',
  negotiations = [],
  selectedNegId,
  onSelectNeg,
  onNegotiationsUpdated,
  onStartNew,
  onProceedOrder,
  showToast,
}) {
  const [messageInput, setMessageInput] = useState('');
  const [showBottomOffer, setShowBottomOffer] = useState(false);
  const [bottomOfferInput, setBottomOfferInput] = useState('');

  const [inlineCounterOpen, setInlineCounterOpen] = useState(false);
  const [inlineOfferInput, setInlineOfferInput] = useState('');
  const [inlineNoteInput, setInlineNoteInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const inlineOfferRef = useRef(null);
  const bottomOfferRef = useRef(null);
  const feedEndRef = useRef(null);

  const isBuyer = role === 'buyer';
  const activeNeg =
    negotiations.length > 0
      ? negotiations.find((n) => n.id === selectedNegId) || negotiations[0]
      : null;

  const activeStatus = (activeNeg?.status || 'active').toLowerCase();
  const statusStyle = STATUS_BADGE[activeStatus] || STATUS_BADGE.active;
  const thread = activeNeg?.thread || [];

  // Determine which incoming offer message bubble gets OLX-style inline Accept/Counter/Reject
  let actionableMsgIdx = -1;
  if (activeStatus === 'active' && thread.length > 0) {
    let lastOfferIdx = -1;
    let lastIncomingIdx = -1;
    for (let i = thread.length - 1; i >= 0; i--) {
      const m = thread[i];
      if (m.type === 'accept' || m.type === 'reject') break;
      if (lastOfferIdx === -1 && (m.type === 'offer' || m.type === 'counter')) {
        lastOfferIdx = i;
      }
      if (lastIncomingIdx === -1 && !isMessageFromRole(m, isBuyer)) {
        lastIncomingIdx = i;
      }
      if (lastOfferIdx !== -1 && lastIncomingIdx !== -1) break;
    }

    if (lastOfferIdx !== -1 && !isMessageFromRole(thread[lastOfferIdx], isBuyer)) {
      actionableMsgIdx = lastOfferIdx;
    } else if (lastOfferIdx === -1 && lastIncomingIdx !== -1 && activeNeg?.currentOffer) {
      actionableMsgIdx = lastIncomingIdx;
    }
  }

  useEffect(() => {
    setInlineCounterOpen(false);
    setInlineOfferInput('');
    setInlineNoteInput('');
    setShowBottomOffer(false);
    setBottomOfferInput('');
  }, [activeNeg?.id]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeNeg?.id, thread.length, inlineCounterOpen]);

  useEffect(() => {
    if (inlineCounterOpen) {
      setTimeout(() => inlineOfferRef.current?.focus(), 60);
    }
  }, [inlineCounterOpen]);

  useEffect(() => {
    if (showBottomOffer) {
      setTimeout(() => bottomOfferRef.current?.focus(), 60);
    }
  }, [showBottomOffer]);

  const refreshFromBackend = async () => {
    const updated = await api.getNegotiations();
    onNegotiationsUpdated?.(updated || []);
  };

  const handleDecision = async (action, offerRaw = null, noteRaw = null) => {
    if (!activeNeg || submitting) return;

    const cleanOffer = normalizeAmount(offerRaw);
    const noteText = (noteRaw || '').trim();

    if (action === 'counter' && !cleanOffer) {
      showToast?.('Enter your counter price (₹) to send a Counter Offer.', 'info');
      return;
    }

    setSubmitting(true);
    try {
      await api.decideNegotiation(
        activeNeg.id,
        action,
        role,
        action === 'counter' ? cleanOffer : null,
        noteText || null
      );
      await refreshFromBackend();
      setInlineCounterOpen(false);
      setInlineOfferInput('');
      setInlineNoteInput('');
      setShowBottomOffer(false);
      setBottomOfferInput('');

      const toastMsg =
        action === 'accept'
          ? `Offer accepted at ${normalizeAmount(activeNeg.currentOffer) || 'agreed price'}!`
          : action === 'reject'
          ? 'Offer declined.'
          : action === 'reopen'
          ? 'Negotiation reopened for revised terms.'
          : `Counter offer of ${cleanOffer} sent!`;
      showToast?.(toastMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeNeg || submitting) return;

    const cleanOffer = showBottomOffer ? normalizeAmount(bottomOfferInput) : '';
    const noteText = messageInput.trim();

    if (cleanOffer) {
      await handleDecision('counter', cleanOffer, noteText);
      setMessageInput('');
      return;
    }

    if (!noteText) return;

    setSubmitting(true);
    try {
      await api.sendNegotiationMessage(activeNeg.id, noteText, 'message', null, role);
      await refreshFromBackend();
      setMessageInput('');
    } finally {
      setSubmitting(false);
    }
  };

  if (!negotiations || negotiations.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center" style={{ backgroundColor: colors.white }}>
        <div className="mb-3">
          <i className="fas fa-comments fs-1 text-muted"></i>
        </div>
        <h5 className="fw-bold text-dark mb-1">
          {isBuyer ? 'No Ongoing Negotiations' : 'No Buyer Inquiries Yet'}
        </h5>
        <p className="text-muted small mb-3" style={{ maxWidth: '460px', margin: '0 auto' }}>
          {isBuyer
            ? 'You do not have any active price negotiations with suppliers yet. Start a direct trade negotiation or submit an RFQ to negotiate counter-offers.'
            : 'Inquiries, quotes, and counter-offers from verified buyers will appear here.'}
        </p>
        {isBuyer && onStartNew && (
          <button
            type="button"
            className="btn text-white fw-semibold px-4 py-2"
            style={{ backgroundColor: colors.primary }}
            onClick={onStartNew}
          >
            <i className="fas fa-plus me-1"></i> Start New Negotiation
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden chat-window-container" style={{ backgroundColor: colors.white }}>
      <div className="row g-0 h-100" style={{ minHeight: 0 }}>
        {/* Conversation List Sidebar */}
        <div className="col-12 col-md-4 border-end chat-sidebar-mobile h-100 d-flex flex-column" style={{ minHeight: 0 }}>
          <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center flex-shrink-0">
            <div>
              <h6 className="fw-bold mb-0 text-dark">
                {isBuyer ? 'Supplier Negotiations' : 'Buyer Negotiations'}
              </h6>
              <div className="small text-muted" style={{ fontSize: '11px' }}>
                {isBuyer ? 'Direct trade chat with mill reps' : 'Live buyer offers & counter terms'}
              </div>
            </div>
            {isBuyer && onStartNew && (
              <button
                type="button"
                className="btn btn-sm btn-outline-success py-1 px-2 text-nowrap d-flex align-items-center gap-1"
                onClick={onStartNew}
                title="Start new negotiation"
              >
                <i className="fas fa-plus"></i>
                <span>New</span>
              </button>
            )}
          </div>

          <div className="overflow-auto flex-grow-1" style={{ minHeight: 0 }}>
            {negotiations.map((neg) => {
              const itemStatus = (neg.status || 'active').toLowerCase();
              const itemBadge = STATUS_BADGE[itemStatus] || STATUS_BADGE.active;
              const isSelected = activeNeg?.id === neg.id;
              const counterparty = isBuyer ? neg.seller : neg.buyer || 'Verified Buyer';

              return (
                <div
                  key={neg.id}
                  className="p-3 border-bottom cursor-pointer transition-all"
                  style={{
                    backgroundColor: isSelected ? colors.primarySubtle : colors.white,
                    borderLeft: isSelected ? `4px solid ${colors.primary}` : '4px solid transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => onSelectNeg(neg.id)}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark small text-truncate pe-2">{counterparty}</strong>
                    <span className="small text-muted flex-shrink-0" style={{ fontSize: '11px' }}>
                      {neg.lastTime}
                    </span>
                  </div>
                  <div className="small text-muted text-truncate mb-1.5" style={{ fontSize: '12px' }}>
                    {neg.product} ({neg.qty})
                  </div>
                  <div className="d-flex justify-content-between align-items-center gap-1 flex-wrap">
                    <span className="badge bg-light text-dark border" style={{ fontSize: '11px' }}>
                      Offer: {normalizeAmount(neg.currentOffer) || 'Open'}
                    </span>
                    <div className="d-flex align-items-center gap-1">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: itemBadge.bg,
                          color: itemBadge.color,
                          border: `1px solid ${itemBadge.border}`,
                          fontSize: '9.5px',
                        }}
                      >
                        {itemBadge.label}
                      </span>
                      {neg.unread > 0 && (
                        <span className="badge bg-danger rounded-pill" style={{ fontSize: '10px' }}>
                          {neg.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Thread & Inline OLX Offer Actions */}
        <div className="col-12 col-md-8 chat-thread-mobile h-100 d-flex flex-column" style={{ minHeight: 0 }}>
          {activeNeg ? (
            <>
              {/* Thread Header */}
              <div className="p-2.5 p-sm-3 border-bottom d-flex justify-content-between align-items-center gap-2 bg-light flex-shrink-0">
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                  <img
                    src={
                      (isBuyer ? activeNeg.sellerAvatar : null) ||
                      'https://randomuser.me/api/portraits/men/32.jpg'
                    }
                    alt=""
                    className="rounded-circle flex-shrink-0"
                    style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                  />
                  <div className="overflow-hidden">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <h6 className="fw-bold mb-0 text-dark text-truncate">
                        {isBuyer ? activeNeg.seller : activeNeg.buyer || 'Verified Buyer'}
                      </h6>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                          fontSize: '10px',
                        }}
                      >
                        {statusStyle.label}
                      </span>
                    </div>
                    <div className="small text-muted text-truncate" style={{ fontSize: '12px' }}>
                      {activeNeg.product} • {activeNeg.qty}
                      {activeNeg.rfqId ? ` • ${activeNeg.rfqId}` : ''}
                    </div>
                  </div>
                </div>

                <div className="text-end flex-shrink-0">
                  <div className="small text-muted" style={{ fontSize: '11px' }}>
                    Current Offer
                  </div>
                  <strong className="text-success" style={{ fontSize: '15px' }}>
                    {normalizeAmount(activeNeg.currentOffer) || 'Open'}
                  </strong>
                </div>
              </div>

              {/* Scrollable Message Feed */}
              <div
                className="p-3 p-sm-4 overflow-auto flex-grow-1 d-flex flex-column gap-3"
                style={{ backgroundColor: '#f8fafc', minHeight: 0 }}
              >
                {thread.map((msg, idx) => {
                  const isMe = isMessageFromRole(msg, isBuyer);
                  const isAccept = msg.type === 'accept';
                  const isReject = msg.type === 'reject';
                  const showOlxActions = idx === actionableMsgIdx;

                  let bubbleBg = isMe ? colors.primary : colors.white;
                  let bubbleText = isMe ? colors.white : colors.textDark;
                  let bubbleBorder = isMe ? 'none' : `1px solid ${colors.border}`;

                  if (isAccept) {
                    bubbleBg = '#ecfdf5';
                    bubbleText = '#065f46';
                    bubbleBorder = '1px solid #6ee7b7';
                  } else if (isReject) {
                    bubbleBg = '#fef2f2';
                    bubbleText = '#991b1b';
                    bubbleBorder = '1px solid #fca5a5';
                  }

                  return (
                    <div
                      key={idx}
                      className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}
                    >
                      <div className="small text-muted mb-0.5 px-1" style={{ fontSize: '10.5px' }}>
                        {isMe
                          ? isBuyer
                            ? 'You (Buyer)'
                            : 'You (Mill / Seller)'
                          : isBuyer
                          ? `${activeNeg.seller} (Supplier)`
                          : `${activeNeg.buyer || 'Buyer'} (Procurement)`}
                      </div>

                      <div
                        className="rounded-4 shadow-sm overflow-hidden"
                        style={{
                          maxWidth: showOlxActions ? '86%' : '78%',
                          backgroundColor: bubbleBg,
                          color: bubbleText,
                          border: bubbleBorder,
                          fontSize: '13.5px',
                        }}
                      >
                        <div className="p-2.5 p-sm-3">
                          {isAccept && (
                            <div className="mb-1 fw-bold small">
                              <span className="badge bg-success text-white">
                                ✓ OFFER ACCEPTED{msg.amount ? `: ${normalizeAmount(msg.amount)}` : ''}
                              </span>
                            </div>
                          )}
                          {isReject && (
                            <div className="mb-1 fw-bold small">
                              <span className="badge bg-danger text-white">
                                ✕ OFFER DECLINED{msg.amount ? `: ${normalizeAmount(msg.amount)}` : ''}
                              </span>
                            </div>
                          )}
                          {(msg.type === 'counter' || msg.type === 'offer') && msg.amount && (
                            <div className="mb-1 fw-bold small">
                              <span className={`badge ${isMe ? 'bg-light text-success' : 'bg-success text-white'}`}>
                                {msg.type === 'counter' ? 'COUNTER OFFER' : 'OFFER'}: {normalizeAmount(msg.amount)}
                              </span>
                            </div>
                          )}
                          {showOlxActions && !msg.amount && activeNeg.currentOffer && (
                            <div className="mb-1 fw-bold small">
                              <span className="badge bg-success text-white">
                                OFFER: {normalizeAmount(activeNeg.currentOffer)}
                              </span>
                            </div>
                          )}
                          <div>{msg.text}</div>
                          <div
                            className="text-end mt-1 small"
                            style={{ fontSize: '10px', opacity: 0.78 }}
                          >
                            {msg.time}
                          </div>
                        </div>

                        {/* OLX-style inline Counter / Accept / Reject directly below offer message */}
                        {showOlxActions && (
                          <div
                            className="px-2.5 py-2 border-top"
                            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                          >
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={() => handleDecision('accept')}
                                className="btn btn-sm btn-success fw-semibold px-3 py-1 rounded-pill d-flex align-items-center gap-1"
                                style={{ fontSize: '12px' }}
                              >
                                <i className="fas fa-check"></i>
                                <span>Accept</span>
                              </button>
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={() => setInlineCounterOpen((prev) => !prev)}
                                className={`btn btn-sm fw-semibold px-3 py-1 rounded-pill d-flex align-items-center gap-1 ${
                                  inlineCounterOpen ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'
                                }`}
                                style={{ fontSize: '12px' }}
                              >
                                <i className="fas fa-exchange-alt"></i>
                                <span>Counter</span>
                              </button>
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={() => handleDecision('reject')}
                                className="btn btn-sm btn-outline-danger fw-semibold px-3 py-1 rounded-pill d-flex align-items-center gap-1"
                                style={{ fontSize: '12px' }}
                              >
                                <i className="fas fa-times"></i>
                                <span>Reject</span>
                              </button>
                            </div>

                            {inlineCounterOpen && (
                              <form
                                className="mt-2 pt-2 border-top d-flex flex-column gap-2"
                                style={{ borderColor: '#e2e8f0' }}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleDecision('counter', inlineOfferInput, inlineNoteInput);
                                }}
                              >
                                <div className="d-flex flex-column flex-sm-row gap-2">
                                  <div className="input-group input-group-sm" style={{ maxWidth: '170px' }}>
                                    <span className="input-group-text fw-semibold">₹</span>
                                    <input
                                      ref={inlineOfferRef}
                                      type="text"
                                      className="form-control shadow-none"
                                      placeholder="e.g. 1,600/MT"
                                      value={inlineOfferInput}
                                      onChange={(e) => setInlineOfferInput(e.target.value)}
                                      required
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm shadow-none flex-grow-1"
                                    placeholder="Optional note (e.g. 100% LC advance)..."
                                    value={inlineNoteInput}
                                    onChange={(e) => setInlineNoteInput(e.target.value)}
                                  />
                                </div>
                                <div className="d-flex justify-content-end gap-1.5">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link text-muted text-decoration-none py-0.5 px-2"
                                    style={{ fontSize: '12px' }}
                                    onClick={() => setInlineCounterOpen(false)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-sm btn-warning text-dark fw-semibold py-0.5 px-3"
                                    style={{ fontSize: '12px' }}
                                  >
                                    Send Counter Offer
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={feedEndRef} />
              </div>

              {/* Clean Bottom Chat Composer (OLX style) */}
              {activeStatus === 'accepted' ? (
                <div className="p-2.5 p-sm-3 border-top bg-white flex-shrink-0">
                  <div
                    className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 p-2 px-3 rounded-3 mb-2"
                    style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}
                  >
                    <div className="small text-success fw-semibold">
                      <i className="fas fa-check-circle me-1.5"></i>
                      Deal Accepted at <strong>{normalizeAmount(activeNeg.currentOffer)}</strong>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {isBuyer && onProceedOrder && (
                        <button
                          type="button"
                          className="btn btn-sm btn-success fw-semibold"
                          onClick={() => onProceedOrder(activeNeg)}
                        >
                          <i className="fas fa-shopping-bag me-1"></i> Proceed to Order
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        disabled={submitting}
                        onClick={() => handleDecision('reopen')}
                      >
                        Reopen Terms
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSendMessage} className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder="Send dispatch or contract follow-up message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={submitting || !messageInput.trim()}
                      className="btn btn-sm text-white px-3 fw-semibold text-nowrap"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <i className="fas fa-paper-plane me-1"></i> Send
                    </button>
                  </form>
                </div>
              ) : activeStatus === 'rejected' ? (
                <div className="p-2.5 p-sm-3 border-top bg-white flex-shrink-0">
                  <div
                    className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 p-2 px-3 rounded-3"
                    style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                  >
                    <div className="small text-danger fw-semibold">
                      <i className="fas fa-times-circle me-1.5"></i>
                      Offer Declined ({normalizeAmount(activeNeg.currentOffer) || 'closed'})
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-warning text-dark fw-semibold text-nowrap"
                      disabled={submitting}
                      onClick={() => handleDecision('reopen')}
                    >
                      <i className="fas fa-redo me-1"></i> Reopen &amp; Make Offer
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="p-2.5 p-sm-3 border-top bg-white flex-shrink-0">
                  {showBottomOffer && (
                    <div className="d-flex align-items-center gap-2 mb-2 p-2 rounded-3 bg-light border">
                      <span className="small fw-semibold text-dark text-nowrap">Propose Price:</span>
                      <div className="input-group input-group-sm" style={{ maxWidth: '200px' }}>
                        <span className="input-group-text fw-semibold">₹</span>
                        <input
                          ref={bottomOfferRef}
                          type="text"
                          className="form-control shadow-none"
                          placeholder="e.g. 1,600/MT"
                          value={bottomOfferInput}
                          onChange={(e) => setBottomOfferInput(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-muted ms-auto p-0 text-decoration-none"
                        onClick={() => {
                          setShowBottomOffer(false);
                          setBottomOfferInput('');
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBottomOffer((prev) => !prev)}
                      className={`btn btn-sm fw-semibold text-nowrap d-flex align-items-center gap-1 ${
                        showBottomOffer ? 'btn-success text-white' : 'btn-outline-success'
                      }`}
                      title="Attach a price offer"
                    >
                      <span className="fw-bold">₹</span>
                      <span>Make Offer</span>
                    </button>

                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder={
                        showBottomOffer
                          ? 'Optional note with your offer...'
                          : 'Type a message...'
                      }
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />

                    <button
                      type="submit"
                      disabled={submitting || (!messageInput.trim() && !(showBottomOffer && bottomOfferInput.trim()))}
                      className="btn btn-sm text-white px-3 fw-semibold text-nowrap d-flex align-items-center gap-1"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <i className="fas fa-paper-plane"></i>
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted p-4">
              <i className="fas fa-comments fs-2 mb-2"></i>
              <div>Select a conversation from the left to view negotiation messages.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
