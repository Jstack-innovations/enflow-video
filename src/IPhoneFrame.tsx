export const IPHONE_W = 438;
export const IPHONE_H = 910;
// Screen area inside the frame is 400 x 872 (design your screens at that size).

export const IPhoneFrame: React.FC<{
  scale?: number;
  shadow?: boolean;
  children: React.ReactNode;
}> = ({ scale = 1, shadow = true, children }) => {
  const side = {
    position: "absolute" as const,
    width: 5,
    background: "#2a2a2d",
    borderRadius: 3,
  };
  return (
    <div
      style={{
        position: "relative",
        width: IPHONE_W * scale,
        height: IPHONE_H * scale,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: IPHONE_W,
          height: IPHONE_H,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        <div style={{ ...side, left: -4, top: 150, height: 44 }} />
        <div style={{ ...side, left: -4, top: 230, height: 80 }} />
        <div style={{ ...side, left: -4, top: 330, height: 80 }} />
        <div style={{ ...side, right: -4, top: 260, height: 120 }} />
        <div
          style={{
            width: IPHONE_W,
            height: IPHONE_H,
            boxSizing: "border-box",
            borderRadius: 78,
            background: "#0b0b0c",
            border: "3px solid #4a4a4f",
            padding: 16,
            boxShadow: shadow ? "0 14px 36px rgba(0,0,0,0.5)" : "none",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 400,
              height: 872,
              borderRadius: 58,
              overflow: "hidden",
              background: "#000",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 137,
                width: 126,
                height: 36,
                borderRadius: 20,
                background: "#000",
                zIndex: 10,
              }}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
