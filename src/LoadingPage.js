

export default function LoadingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img src="/LogoPerthel.png" alt="Logo" style={{ width: 200, margin: 20 }} />
      <img src="/loadingGIF.gif" alt="Loading" style={{ width: 100 }} />
    </div>
  )
}