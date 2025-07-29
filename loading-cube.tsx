"use client"

export default function LoadingCube() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="relative">
        <div className="cube-loader">
          <div className="cube-face cube-front"></div>
          <div className="cube-face cube-back"></div>
          <div className="cube-face cube-right"></div>
          <div className="cube-face cube-left"></div>
          <div className="cube-face cube-top"></div>
          <div className="cube-face cube-bottom"></div>
        </div>
        <p className="text-white text-xl mt-8 text-center animate-pulse">در حال بارگذاری...</p>
      </div>

      <style jsx>{`
        .cube-loader {
          width: 80px;
          height: 80px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotate 2s infinite linear;
        }
        
        .cube-face {
          position: absolute;
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc);
          border: 2px solid #e879f9;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }
        
        .cube-front { transform: rotateY(0deg) translateZ(40px); }
        .cube-back { transform: rotateY(180deg) translateZ(40px); }
        .cube-right { transform: rotateY(90deg) translateZ(40px); }
        .cube-left { transform: rotateY(-90deg) translateZ(40px); }
        .cube-top { transform: rotateX(90deg) translateZ(40px); }
        .cube-bottom { transform: rotateX(-90deg) translateZ(40px); }
        
        @keyframes rotate {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  )
}
