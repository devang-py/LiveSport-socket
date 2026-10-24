export default function CommentaryItem({ item, isNew }) {
  const eventClass = item.eventType?.toLowerCase().includes('goal')
    ? 'goal'
    : item.eventType?.toLowerCase().includes('foul')
    ? 'foul'
    : item.eventType?.toLowerCase().includes('substitution')
    ? 'substitution'
    : '';

  return (
    <div className={`commentary-item${isNew ? ' new' : ''}`}>
      <div className="commentary-minute">
        {item.minute != null ? `${item.minute}'` : '#' + item.sequence}
      </div>
      <div className="commentary-body">
        <span className={`commentary-event-type ${eventClass}`}>
          {item.eventType}
        </span>
        <p className="commentary-message">
          {item.actor && <span className="commentary-actor">{item.actor} </span>}
          {item.message}
        </p>
        {item.team && <div className="commentary-team">{item.team}</div>}
        {item.tags && item.tags.length > 0 && (
          <div className="commentary-tags">
            {item.tags.map((tag, i) => (
              <span key={i} className="commentary-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
