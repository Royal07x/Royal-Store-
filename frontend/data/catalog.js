export const categories = [
  { id: 'pants', name: 'Pants', icon: '👖', description: 'Everyday fits with a clean royal finish.' },
  { id: 'shirt', name: 'Shirt', icon: '👕', description: 'Easy shirts for casual and polished looks.' },
  { id: 'beauty', name: 'Beauty', icon: '💄', description: 'Simple beauty essentials for everyday routines.' },
  { id: 'sneakers', name: 'Sneakers', icon: '👟', description: 'Comfort-focused sneakers for daily movement.' },
  { id: 'kids-toy', name: "Kid’s Toy", icon: '🧸', description: 'Fun, age-appropriate toys for kids.' }
];

export const products = [
  { id: 'pants-001', category: 'pants', name: 'Royal Relaxed Trousers', price: 1299, rating: 4.7, badge: 'New', emoji: '👖', description: 'Relaxed everyday trousers with a clean silhouette.' },
  { id: 'pants-002', category: 'pants', name: 'Classic Utility Pants', price: 1499, rating: 4.6, badge: 'Popular', emoji: '👖', description: 'Practical utility styling for everyday outfits.' },
  { id: 'shirt-001', category: 'shirt', name: 'Soft Cotton Shirt', price: 899, rating: 4.8, badge: 'Best seller', emoji: '👕', description: 'Soft cotton feel with a versatile everyday cut.' },
  { id: 'shirt-002', category: 'shirt', name: 'Royal Overshirt', price: 1199, rating: 4.5, badge: 'New', emoji: '👕', description: 'Layer-friendly overshirt with a modern fit.' },
  { id: 'beauty-001', category: 'beauty', name: 'Glow Care Set', price: 799, rating: 4.7, badge: 'Popular', emoji: '💄', description: 'A simple beauty-care set for an everyday routine.' },
  { id: 'beauty-002', category: 'beauty', name: 'Daily Beauty Essentials', price: 999, rating: 4.6, badge: 'New', emoji: '✨', description: 'Everyday essentials presented as one convenient set.' },
  { id: 'sneakers-001', category: 'sneakers', name: 'Royal Street Sneakers', price: 1899, rating: 4.8, badge: 'Best seller', emoji: '👟', description: 'Comfort-first sneakers with a clean street style.' },
  { id: 'sneakers-002', category: 'sneakers', name: 'Cloud Walk Sneakers', price: 2099, rating: 4.7, badge: 'New', emoji: '👟', description: 'Light everyday styling designed around comfort.' },
  { id: 'kids-toy-001', category: 'kids-toy', name: 'Cuddle Bear', price: 699, rating: 4.9, badge: 'Popular', emoji: '🧸', description: 'A soft, playful companion for kids.' },
  { id: 'kids-toy-002', category: 'kids-toy', name: 'Build & Play Blocks', price: 899, rating: 4.6, badge: 'New', emoji: '🧩', description: 'Creative building play for age-appropriate fun.' }
];

export const getCategory = (id) => categories.find((category) => category.id === id);
export const getProductsByCategory = (id) => products.filter((product) => product.category === id);
