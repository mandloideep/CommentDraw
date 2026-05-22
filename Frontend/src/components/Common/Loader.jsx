function Loader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-ink/70 dark:bg-ink/85">
      <div className="flex gap-2" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 bg-paper inline-block"
            style={{
              animation: "cd-pulse-square 1s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Loader;
