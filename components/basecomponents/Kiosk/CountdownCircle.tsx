const CountdownCircle = ({ countdown, radius, countdownTime }: { countdown: number; radius: number; countdownTime: number }) => {
  // Calculate progress percentage and create a gradient based on this
  const baseCircleColor = '#013abd33';
  const progressPercentage = (countdown / (countdownTime / 1000)) * 100;
  const gradientColor = progressPercentage > 0 ? `#FAD741` : baseCircleColor;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (progressPercentage / 100) * circumference;
  return (
    <div>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="60" cy="60" r={radius} stroke={baseCircleColor} strokeWidth="6" fill="transparent" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={gradientColor}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
        <text
          x="48%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          style={{
            fontWeight: '700',
            fontSize: '42px',
            lineHeight: '49px',
            fill: '#023ABD',
          }}
        >
          {countdown}
        </text>
      </svg>
    </div>
  );
};
export default CountdownCircle;
