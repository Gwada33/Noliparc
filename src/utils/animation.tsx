export function generateShapes(count: number = 20): React.ReactNode[] {
  return [...Array(count)].map((_, i) => {
    const size = Math.floor(Math.random() * 300) + 50;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;

    return (
      <div
        key={i}
        className="pattern-shape-login"
        style={{
          width: size,
          height: size,
          top: `${top}%`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });
}
