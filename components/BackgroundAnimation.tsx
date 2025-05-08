export function BackgroundAnimation() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] rounded-full bg-gradient-to-br from-blue-500 to-green-500 animate-pulse opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full bg-gradient-to-br from-green-500 to-yellow-500 animate-pulse opacity-50"></div>
    </div>
  )
}
