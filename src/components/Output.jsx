export default function OutputPanel({
  messages,
}) {
  return (
    <div className="card">
      <h2>Output</h2>

      {messages.length === 0 ? (
        <p>No activity yet</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}