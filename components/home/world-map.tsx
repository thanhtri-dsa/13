'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function WorldMap() {
  const geo = {
    minLon: -169.110266,
    maxLat: 83.600842,
    maxLon: 190.486279,
    minLat: -58.508473,
  };

  const geoToPercent = useCallback((lat: number, lon: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const mercY = (degLat: number) => Math.log(Math.tan(Math.PI / 4 + toRad(degLat) / 2));

    const left = ((lon - geo.minLon) / (geo.maxLon - geo.minLon)) * 100;
    const top =
      ((mercY(geo.maxLat) - mercY(lat)) / (mercY(geo.maxLat) - mercY(geo.minLat))) * 100;

    return { left, top };
  }, [geo.maxLat, geo.maxLon, geo.minLat, geo.minLon]);

  const vietnamDefault = useMemo(() => geoToPercent(14.0583, 108.2772), [geoToPercent]);
  const [vietnam, setVietnam] = useState<{ left: number; top: number }>(vietnamDefault);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('worldmap_vietnam_marker');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { left?: number; top?: number };
      if (typeof parsed.left !== 'number' || typeof parsed.top !== 'number') return;
      if (!Number.isFinite(parsed.left) || !Number.isFinite(parsed.top)) return;
      setVietnam({ left: parsed.left, top: parsed.top });
    } catch {}
  }, []);

  const onPickVietnam = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.shiftKey) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const left = ((e.clientX - rect.left) / rect.width) * 100;
    const top = ((e.clientY - rect.top) / rect.height) * 100;
    if (!Number.isFinite(left) || !Number.isFinite(top)) return;
    const next = { left: Math.max(0, Math.min(100, left)), top: Math.max(0, Math.min(100, top)) };
    setVietnam(next);
    try {
      localStorage.setItem('worldmap_vietnam_marker', JSON.stringify(next));
    } catch {}
  }, []);

  return (
    <section className="py-20 vn-pattern overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="vn-title text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Cùng lên đường và khám phá thế giới xanh
          </h2>
          
          <p className="inline-block py-2 px-6 text-sm font-bold text-primary bg-secondary/20 rounded-full shadow-sm">
            Tận hưởng kỳ nghỉ của bạn một cách trọn vẹn nhất
          </p>
        </motion.div>
        
        <div className="relative mt-16 group">
          <div className="mx-auto max-w-6xl relative" onClick={onPickVietnam}>
            {/* Decorative background circle */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-90 pointer-events-none" />
            
            <div className="relative w-full aspect-[1009/666] transition-transform duration-700 group-hover:scale-[1.02]">
              <Image
                src="/images/world.svg"
                alt="Bản đồ thế giới"
                fill
                priority
                className="object-contain opacity-80 filter grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                sizes="100vw"
              />
            </div>
            
            <MapMarker left="15%" top="25%" title="Bắc Mỹ" />
            <MapMarker left="30%" top="35%" title="Trung Mỹ" />
            <MapMarker left="45%" top="20%" title="Châu Âu" />
            <MapMarker left="55%" top="35%" title="Trung Đông" />
            <MapMarker left="60%" top="45%" title="Ấn Độ" />
            <MapMarker left="70%" top="30%" title="Đông Á" />
            <MapMarker left="20%" top="50%" title="Nam Mỹ" />
            <MapMarker left="50%" top="55%" title="Châu Phi" />
            <MapMarker left="80%" top="50%" title="Châu Úc" />
            {/* Vietnam highlight */}
            <MapMarker left={`${vietnam.left}%`} top={`${vietnam.top}%`} title="Việt Nam" isSpecial />
          </div>
        </div>
      </div>
    </section>
  );
}

function MapMarker({
  left,
  top,
  title,
  isSpecial = false
}: {
  left: string;
  top: string;
  title: string;
  isSpecial?: boolean;
}) {
  return (
    <div
      className="absolute group/marker z-20"
      style={{
        left,
        top
      }}
    >
      {/* Pulse ring */}
      <div className={`absolute -inset-2 rounded-full animate-ping opacity-20 ${isSpecial ? 'bg-secondary' : 'bg-primary'}`} />
      
      {/* Main dot */}
      <div className={`relative w-4 h-4 rounded-full shadow-lg cursor-pointer transition-transform duration-300 group-hover/marker:scale-150 ${isSpecial ? 'bg-secondary border-2 border-primary' : 'bg-primary'}`} />
      
      {/* Label */}
      <div className={`absolute left-6 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl shadow-2xl text-xs font-bold opacity-0 group-hover/marker:opacity-100 transition-all duration-300 whitespace-nowrap translate-x-2 group-hover/marker:translate-x-0 ${isSpecial ? 'bg-primary text-white' : 'bg-white text-gray-900 border border-border'}`}>
        {title}
      </div>
    </div>
  );
}

export default WorldMap;
