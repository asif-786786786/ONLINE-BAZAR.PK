import React from 'react';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={product.images[0] || `https://picsum.photos/seed/${product.id}/400/300`} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors shadow-sm">
          <Heart className="h-5 w-5" />
        </button>
        {product.isFeatured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-amber-950 font-bold rounded-full text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            <span>Featured</span>
          </div>
        )}
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-1 bg-white text-black font-bold rounded-full text-sm uppercase tracking-wider">Sold</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 truncate flex-1">{product.title}</h3>
          <span className="text-xl font-extrabold text-emerald-600 ml-2">
            ${product.price.toLocaleString()}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{product.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(product.createdAt))} ago</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
