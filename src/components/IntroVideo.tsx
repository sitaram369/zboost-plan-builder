import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface IntroVideoProps {
  onComplete: () => void;
}

const IntroVideo = ({ onComplete }: IntroVideoProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-contain"
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute bottom-8 right-8 flex gap-3">
        <Button
          onClick={toggleMute}
          variant="outline"
          size="icon"
          className="bg-background/20 border-border/50 text-white hover:bg-background/40"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Button
          onClick={handleSkip}
          variant="outline"
          className="bg-background/20 border-border/50 text-white hover:bg-background/40"
        >
          Skip Intro
        </Button>
      </div>
    </div>
  );
};

export default IntroVideo;
