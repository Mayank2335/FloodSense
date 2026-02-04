import { useEffect, useRef } from 'react';

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Mesh Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-gentle" />
      <div className="absolute top-[20%] left-[-100px] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[60px]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* India Map Outline */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
         <svg viewBox="0 0 1000 1000" className="w-[90vmin] h-[90vmin] text-slate-800" style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.1))' }}>
            <path 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M438 65 L462 48 L490 60 L515 52 L540 65 L565 60 L580 80 L600 75 L615 90 L630 85 L650 100 L640 120 L660 135 L680 130 L700 145 L720 140 L740 160 L730 180 L710 190 L690 185 L675 200 L690 220 L710 215 L730 230 L750 240 L775 235 L800 250 L820 245 L840 260 L830 280 L810 290 L790 300 L770 310 L785 330 L800 350 L790 370 L770 380 L750 390 L735 400 L720 420 L740 435 L760 450 L740 470 L720 490 L700 510 L680 530 L660 550 L640 570 L620 590 L600 610 L585 630 L570 650 L560 680 L550 710 L540 740 L530 770 L520 800 L510 830 L500 860 L490 890 L480 860 L470 830 L460 800 L450 770 L440 740 L430 710 L420 680 L410 650 L400 630 L390 610 L380 590 L360 570 L340 550 L320 530 L300 510 L280 490 L260 470 L240 450 L220 430 L200 410 L220 390 L240 375 L260 360 L240 340 L220 320 L200 300 L180 280 L160 260 L180 240 L200 230 L220 215 L240 200 L260 185 L280 170 L300 155 L320 140 L340 125 L360 110 L380 100 L400 90 L420 80 Z" 
            />
         </svg>
      </div>

      {/* Subtle Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
