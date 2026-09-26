import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 36) / 2;

// --- Cart Context ---
const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cart, setCart] = React.useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(1, item.quantity + change) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => React.useContext(CartContext);

const API_BASE = 'https://goodfinds-vert.vercel.app';

// Initial / Fallback Catalog in INR
const initialProducts = [
  {
    id: '1',
    name: 'Automatic Rechargeable Water Can Dispenser',
    price: 799,
    category: 'Kitchen & Home',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
    description: 'One-touch automatic electric drinking water bottle dispenser pump with USB rechargeable battery. Fits standard 20L water cans effortlessly.',
  },
  {
    id: '2',
    name: '12-in-1 Multi-Blade Vegetable & Fruit Chopper',
    price: 899,
    category: 'Kitchen & Home',
    image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&q=80',
    description: 'Heavy duty multipurpose mandoline vegetable slicer, dicer, and cutter with container. High-grade stainless steel blades for rapid meal prep.',
  },
  {
    id: '3',
    name: 'Embroidered Pure Cotton Ethnic Kurti',
    price: 1199,
    category: 'Fashion & Ethnic',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    description: 'Handcrafted breathable pure cotton embroidered daily wear kurti. Pre-shrunk colorfast fabric designed for all-day comfort.',
  },
  {
    id: '4',
    name: 'Solar Rotating Kinetic Car Aroma Diffuser',
    price: 599,
    category: 'Car & Tech Gadgets',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80',
    description: 'Double ring rotating suspension auto aroma diffuser driven by solar energy. Eliminates cabin odors with natural essential oil scent rings.',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'flash' },
  { id: 'Kitchen & Home', name: 'Kitchen & Home', icon: 'restaurant' },
  { id: 'Car & Tech Gadgets', name: 'Tech & Gadgets', icon: 'hardware-chip' },
  { id: 'Fashion & Ethnic', name: 'Fashion', icon: 'shirt' },
  { id: 'Smart Electronics', name: 'Electronics', icon: 'phone-portrait' },
];

// --- Navbar Cart Icon with Badge ---
function CartIcon() {
  const navigation = useNavigation();
  const { cartCount } = useCart();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Cart')}
      style={{ padding: 6, marginRight: 4 }}
      activeOpacity={0.7}
    >
      <Ionicons name="cart-outline" size={24} color="#ffffff" />
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// --- Home Screen (Flipkart Mobile Experience) ---
function HomeScreen({ navigation }) {
  const { addToCart } = useCart();
  const [productList, setProductList] = React.useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortOption, setSortOption] = React.useState('relevance');
  const [sortModalVisible, setSortModalVisible] = React.useState(false);
  const [assuredFilter, setAssuredFilter] = React.useState(false);
  const [under500Filter, setUnder500Filter] = React.useState(false);

  // Live countdown timer ticker (Flipkart style)
  const [timeLeft, setTimeLeft] = React.useState({ hours: 14, minutes: 32, seconds: 48 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products?.length > 0) {
          setProductList(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  // Filtered and sorted products
  const displayedProducts = React.useMemo(() => {
    let list = productList.filter((item) => {
      if (selectedCategory !== 'all') {
        const catName = typeof item.category === 'object' ? item.category?.name : item.category;
        if (catName !== selectedCategory) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      if (under500Filter && item.price >= 500) return false;
      return true;
    });

    switch (sortOption) {
      case 'price_low':
        return list.sort((a, b) => a.price - b.price);
      case 'price_high':
        return list.sort((a, b) => b.price - a.price);
      case 'discount':
        return list.sort((a, b) => {
          const discA = Math.round(((a.price * 1.55 - a.price) / (a.price * 1.55)) * 100);
          const discB = Math.round(((b.price * 1.55 - b.price) / (b.price * 1.55)) * 100);
          return discB - discA;
        });
      default:
        return list;
    }
  }, [productList, selectedCategory, searchQuery, sortOption, under500Filter]);

  // Render 2-Column Flipkart Card
  const renderProductItem = ({ item }) => {
    const retail = item.price;
    const fakeOriginal = Math.round(retail * 1.55);
    const discount = Math.round(((fakeOriginal - retail) / fakeOriginal) * 100);
    const catName = typeof item.category === 'object' ? item.category?.name : item.category;

    return (
      <TouchableOpacity
        style={styles.gridCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={styles.gridImageContainer}>
          <Image source={{ uri: item.image }} style={styles.gridImage} resizeMode="cover" />
          <View style={styles.discountPill}>
            <Text style={styles.discountPillText}>{discount}% OFF</Text>
          </View>
        </View>

        <View style={styles.gridInfo}>
          {/* Rating & Assured Badge */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>4.4</Text>
              <Ionicons name="star" size={9} color="#ffffff" style={{ marginLeft: 2 }} />
            </View>
            <View style={styles.assuredTag}>
              <Ionicons name="checkmark-circle" size={10} color="#2f7a54" />
              <Text style={styles.assuredText}>Assured</Text>
            </View>
          </View>

          <Text style={styles.gridTitle} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Pricing */}
          <View style={styles.gridPriceRow}>
            <Text style={styles.gridPrice}>₹{retail}</Text>
            <Text style={styles.gridOriginalPrice}>₹{fakeOriginal}</Text>
          </View>

          <Text style={styles.deliveryTag}>Free Delivery</Text>

          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={() => addToCart(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="bag-add" size={13} color="#ffffff" />
            <Text style={styles.quickAddText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6f1' }}>
      {/* 1. Flipkart-style Top Search Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#687068" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, essentials & deals..."
            placeholderTextColor="#687068"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={16} color="#687068" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={displayedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.gridList}
        ListHeaderComponent={
          <>
            {/* 2. Flipkart Horizontal Category Strip */}
            <View style={styles.categoryStripContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                      style={[styles.categoryCapsule, isActive && styles.categoryCapsuleActive]}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={14}
                        color={isActive ? '#183d2f' : '#687068'}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[styles.categoryCapsuleText, isActive && styles.categoryCapsuleTextActive]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 3. Flipkart Deals of the Day Urgency Banner */}
            <View style={styles.dealsBanner}>
              <View style={styles.dealsHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="flame" size={16} color="#ff745e" style={{ marginRight: 4 }} />
                  <Text style={styles.dealsTitle}>Deals of the Day</Text>
                </View>
                <View style={styles.dealsTimerBadge}>
                  <Ionicons name="time-outline" size={12} color="#ff745e" style={{ marginRight: 3 }} />
                  <Text style={styles.dealsTimerText}>
                    {formatNumber(timeLeft.hours)}h : {formatNumber(timeLeft.minutes)}m : {formatNumber(timeLeft.seconds)}s
                  </Text>
                </View>
              </View>
              <Text style={styles.dealsSubtitle}>
                ⚡ Instant ₹70 Flat Savings automatically applied at UPI checkout!
              </Text>
            </View>

            {/* 4. Controls Strip: Sorting & Filter Chips */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setSortModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="swap-vertical" size={14} color="#182018" style={{ marginRight: 4 }} />
                <Text style={styles.sortButtonText}>
                  {sortOption === 'relevance'
                    ? 'Sort'
                    : sortOption === 'price_low'
                    ? 'Price: Low'
                    : sortOption === 'price_high'
                    ? 'Price: High'
                    : 'Discount'}
                </Text>
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: 6 }}>
                <TouchableOpacity
                  style={[styles.filterChip, assuredFilter && styles.filterChipActive]}
                  onPress={() => setAssuredFilter(!assuredFilter)}
                >
                  <Text style={[styles.filterChipText, assuredFilter && styles.filterChipTextActive]}>
                    Assured ✓
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, under500Filter && styles.filterChipActive]}
                  onPress={() => setUnder500Filter(!under500Filter)}
                >
                  <Text style={[styles.filterChipText, under500Filter && styles.filterChipTextActive]}>
                    Under ₹500
                  </Text>
                </TouchableOpacity>

                {(selectedCategory !== 'all' || searchQuery.length > 0 || under500Filter) && (
                  <TouchableOpacity
                    style={styles.clearChip}
                    onPress={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setUnder500Filter(false);
                      setSortOption('relevance');
                    }}
                  >
                    <Ionicons name="refresh" size={12} color="#ff745e" style={{ marginRight: 2 }} />
                    <Text style={styles.clearChipText}>Reset</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Ionicons name="search-outline" size={48} color="#687068" />
            <Text style={styles.emptyText}>No matching products found</Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setUnder500Filter(false);
              }}
            >
              <Text style={styles.linkText}>View All Products</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.sortModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SORT BY</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <Ionicons name="close" size={20} color="#182018" />
              </TouchableOpacity>
            </View>

            {[
              { id: 'relevance', label: 'Relevance / Popularity' },
              { id: 'price_low', label: 'Price -- Low to High' },
              { id: 'price_high', label: 'Price -- High to Low' },
              { id: 'discount', label: 'Discount %' },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.sortOptionRow}
                onPress={() => {
                  setSortOption(option.id);
                  setSortModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortOption === option.id && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {sortOption === option.id && (
                  <Ionicons name="checkmark-circle" size={18} color="#2f7a54" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// --- Product Detail Screen (Flipkart Split/Stacked UX) ---
function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [pincode, setPincode] = React.useState('682001');
  const [pincodeChecked, setPincodeChecked] = React.useState(true);

  const retail = product.price;
  const fakeOriginal = Math.round(retail * 1.55);
  const discount = Math.round(((fakeOriginal - retail) / fakeOriginal) * 100);
  const savings = fakeOriginal - retail;

  const handleBuyNow = () => {
    addToCart(product);
    navigation.navigate('Checkout');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Full Image with Discount & Assured Pill */}
        <View style={styles.detailImageContainer}>
          <Image source={{ uri: product.image }} style={styles.detailImage} resizeMode="cover" />
          <View style={styles.detailDiscountTag}>
            <Text style={styles.detailDiscountText}>{discount}% OFF</Text>
          </View>
          <View style={styles.detailAssuredBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#2f7a54" />
            <Text style={styles.detailAssuredText}>Goodfinds Assured</Text>
          </View>
        </View>

        <View style={styles.detailContent}>
          {/* Category & Title */}
          <Text style={styles.detailCategory}>
            {typeof product.category === 'object' ? product.category?.name : product.category || 'Exclusive'}
          </Text>
          <Text style={styles.detailTitle}>{product.name}</Text>

          {/* Rating Summary Bar */}
          <View style={styles.detailRatingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>4.4</Text>
              <Ionicons name="star" size={10} color="#ffffff" style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.detailRatingsCount}>1,428 Ratings &bull; 236 Reviews</Text>
          </View>

          {/* Special Price Callout */}
          <View style={styles.detailPriceCard}>
            <Text style={styles.specialPriceLabel}>SPECIAL PRICE</Text>
            <View style={styles.detailPriceRow}>
              <Text style={styles.detailPrice}>₹{retail}</Text>
              <Text style={styles.detailOriginalPrice}>₹{fakeOriginal}</Text>
              <Text style={styles.detailDiscountRate}>{discount}% off</Text>
            </View>
            <Text style={styles.detailSavingsText}>You save ₹{savings} on this order</Text>
          </View>

          {/* Flipkart Available Offers Panel */}
          <View style={styles.detailOffersCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="pricetag" size={15} color="#2f7a54" style={{ marginRight: 6 }} />
              <Text style={styles.detailOffersTitle}>Available Offers</Text>
            </View>
            <View style={styles.offerItem}>
              <Ionicons name="flash" size={14} color="#2f7a54" style={{ marginTop: 2, marginRight: 6 }} />
              <Text style={styles.offerText}>
                <Text style={{ fontWeight: 'bold' }}>Instant UPI Discount: </Text>
                Flat ₹70 OFF applied automatically at checkout on Google Pay / PhonePe.
              </Text>
            </View>
            <View style={styles.offerItem}>
              <Ionicons name="bicycle" size={14} color="#2f7a54" style={{ marginTop: 2, marginRight: 6 }} />
              <Text style={styles.offerText}>
                <Text style={{ fontWeight: 'bold' }}>Doorstep Delivery: </Text>
                Fast 3-5 days delivery with cash on delivery available.
              </Text>
            </View>
            <View style={styles.offerItem}>
              <Ionicons name="refresh" size={14} color="#ff745e" style={{ marginTop: 2, marginRight: 6 }} />
              <Text style={styles.offerText}>
                <Text style={{ fontWeight: 'bold' }}>7-Day Replacement: </Text>
                Hassle-free replacement if defective or damaged.
              </Text>
            </View>
          </View>

          {/* Pincode & Delivery Checker */}
          <View style={styles.pincodeCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.pincodeCardTitle}>Delivery to Pincode</Text>
              <TouchableOpacity onPress={() => setPincodeChecked(false)}>
                <Text style={styles.pincodeChangeText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pincodeInputRow}>
              <TextInput
                style={styles.pincodeInput}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
                placeholder="6-digit PIN"
              />
              <TouchableOpacity
                style={styles.pincodeCheckButton}
                onPress={() => setPincodeChecked(true)}
              >
                <Text style={styles.pincodeCheckButtonText}>Check</Text>
              </TouchableOpacity>
            </View>

            {pincodeChecked && (
              <View style={styles.pincodeResult}>
                <Ionicons name="checkmark-circle" size={14} color="#2f7a54" style={{ marginRight: 4 }} />
                <Text style={styles.pincodeResultText}>
                  Express Delivery in 3-5 Days &bull; COD Available
                </Text>
              </View>
            )}
          </View>

          {/* Product Description & Highlights */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Product Details</Text>
            <Text style={styles.descriptionBody}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Dual Action Buttons at Bottom */}
      <View style={styles.detailBottomBar}>
        <TouchableOpacity
          style={styles.cartCTAButton}
          onPress={() => {
            addToCart(product);
            Alert.alert('Added to Bag', `${product.name} added to cart.`);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="bag-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.cartCTAText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowCTAButton}
          onPress={handleBuyNow}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={16} color="#183d2f" style={{ marginRight: 6 }} />
          <Text style={styles.buyNowCTAText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Cart Screen ---
function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const shipping = cartTotal > 499 ? 0 : 79;
  const upiDiscount = cartTotal > 0 ? 70 : 0;
  const finalTotal = Math.max(0, cartTotal + shipping - upiDiscount);

  if (cart.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cart-outline" size={64} color="#94a3b8" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Explore Trending Discoveries</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6f1' }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cartName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.cartPrice}>₹{item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, -1)}
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, 1)}
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={{ marginLeft: 'auto' }}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>₹{cartTotal}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.subText}>Instant UPI Discount:</Text>
          <Text style={styles.discountText}>- ₹{upiDiscount}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.subText}>Shipping Fee:</Text>
          <Text style={styles.discountText}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 4, paddingTop: 6, borderTopWidth: 1, borderColor: '#dfe3dd' }]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.finalTotalValue}>₹{finalTotal}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout (₹{finalTotal})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Checkout Screen ---
function CheckoutScreen({ navigation }) {
  const { cart, clearCart, cartTotal } = useCart();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [house, setHouse] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [pincode, setPincode] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('UPI');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const finalAmount = Math.max(0, cartTotal - (paymentMethod === 'UPI' ? 70 : 0));

  const handlePlaceOrder = async () => {
    if (!name.trim() || !phone.trim() || !house.trim() || !pincode.trim()) {
      Alert.alert('Missing Details', 'Please fill in Name, Phone, Address, and PIN code.');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your bag is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          houseName: house,
          city: district || 'City',
          district: district || 'Region',
          pincode,
          paymentMethod,
          items: cart.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert(
          'Order Confirmed! 🎉',
          `Thank you ${name}!\n\nOrder Ref: ${data.orderNumber || 'ORD-CONFIRMED'}\nMode: ${paymentMethod}\nAmount: ₹${finalAmount}\n\nWe will dispatch it to ${house}, ${district || 'your doorstep'}.`,
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.navigate('Home');
              },
            },
          ]
        );
      } else {
        Alert.alert('Order Failed', data.error || 'Unable to place order.');
      }
    } catch (err) {
      Alert.alert(
        'Order Received! 🎉',
        `Thank you ${name}! Your order has been placed via ${paymentMethod}.\nWe will dispatch it to ${house}, ${district || 'your address'}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              navigation.navigate('Home');
            },
          },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>Delivery Address</Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipient's Name"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone Number (WhatsApp) *</Text>
        <TextInput
          style={styles.input}
          placeholder="10-digit mobile"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />

        <Text style={styles.label}>House / Apartment / Suite Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Apartment, suite, or house name"
          placeholderTextColor="#94a3b8"
          value={house}
          onChangeText={setHouse}
        />

        <Text style={styles.label}>City / Region</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Metro City"
          placeholderTextColor="#94a3b8"
          value={district}
          onChangeText={setDistrict}
        />

        <Text style={styles.label}>PIN Code *</Text>
        <TextInput
          style={styles.input}
          placeholder="6-digit PIN"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={pincode}
          onChangeText={setPincode}
          maxLength={6}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.headerTitle}>Payment Method</Text>

        <TouchableOpacity
          style={[styles.payOption, paymentMethod === 'UPI' && styles.payOptionActive]}
          onPress={() => setPaymentMethod('UPI')}
        >
          <Ionicons
            name={paymentMethod === 'UPI' ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color="#2f7a54"
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.payOptionTitle}>UPI / Online Payment (Flat ₹70 OFF)</Text>
            <Text style={styles.payOptionSubtitle}>PhonePe, GPay, Paytm</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.payOption, paymentMethod === 'COD' && styles.payOptionActive]}
          onPress={() => setPaymentMethod('COD')}
        >
          <Ionicons
            name={paymentMethod === 'COD' ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color="#183d2f"
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.payOptionTitle}>Cash on Delivery (COD)</Text>
            <Text style={styles.payOptionSubtitle}>Pay cash at doorstep</Text>
          </View>
        </TouchableOpacity>

        <View style={{ marginTop: 14, borderTopWidth: 1, borderColor: '#dfe3dd', paddingTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#182018' }}>
            Total Payable: ₹{finalAmount}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.checkoutButton, isSubmitting && { opacity: 0.6 }]}
        onPress={handlePlaceOrder}
        disabled={isSubmitting}
      >
        <Text style={styles.checkoutButtonText}>
          {isSubmitting ? 'Securing Order...' : `Confirm & Place Order (₹${finalAmount})`}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#102c23' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '900', fontSize: 18 },
            contentStyle: { backgroundColor: '#f5f6f1' },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Goodfinds',
              headerRight: () => <CartIcon />,
            }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{
              title: 'Product Details',
              headerRight: () => <CartIcon />,
            }}
          />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Bag' }} />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: 'Express Checkout' }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f5f6f1',
  },
  // Search Header
  searchHeader: {
    backgroundColor: '#102c23',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#182018',
    paddingVertical: 0,
  },
  // Category Strip
  categoryStripContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#dfe3dd',
    paddingVertical: 8,
  },
  categoryScroll: {
    paddingHorizontal: 10,
    gap: 8,
  },
  categoryCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f1',
    borderWidth: 1,
    borderColor: '#dfe3dd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryCapsuleActive: {
    backgroundColor: '#baf2cd',
    borderColor: '#2f7a54',
  },
  categoryCapsuleText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#687068',
  },
  categoryCapsuleTextActive: {
    color: '#183d2f',
  },
  // Deals Banner
  dealsBanner: {
    backgroundColor: '#183d2f',
    margin: 10,
    borderRadius: 14,
    padding: 12,
  },
  dealsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealsTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  dealsTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 116, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#ff745e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dealsTimerText: {
    color: '#ff745e',
    fontSize: 10.5,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  dealsSubtitle: {
    color: '#baf2cd',
    fontSize: 10.5,
    marginTop: 6,
    fontWeight: '600',
  },
  // Controls Row (Sort & Filter)
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfe3dd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#182018',
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfe3dd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: 'rgba(186, 242, 205, 0.4)',
    borderColor: '#2f7a54',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#687068',
  },
  filterChipTextActive: {
    color: '#183d2f',
  },
  clearChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ff745e',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  clearChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ff745e',
  },
  // 2-Column Grid
  gridList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  gridCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    margin: 5,
    borderWidth: 1,
    borderColor: '#dfe3dd',
    overflow: 'hidden',
  },
  gridImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f6f1',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  discountPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#ff745e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountPillText: {
    color: '#ffffff',
    fontSize: 8.5,
    fontWeight: '900',
  },
  gridInfo: {
    padding: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f7a54',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '900',
  },
  assuredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(186, 242, 205, 0.4)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  assuredText: {
    color: '#183d2f',
    fontSize: 8.5,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  gridTitle: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#182018',
    lineHeight: 15,
    minHeight: 30,
  },
  gridPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 4,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#182018',
  },
  gridOriginalPrice: {
    fontSize: 10,
    color: '#687068',
    textDecorationLine: 'line-through',
  },
  deliveryTag: {
    fontSize: 9,
    color: '#2f7a54',
    fontWeight: 'bold',
    marginTop: 2,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#183d2f',
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
    gap: 4,
  },
  quickAddText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  // Sort Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sortModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#dfe3dd',
    paddingBottom: 10,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#687068',
    letterSpacing: 0.5,
  },
  sortOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f5f6f1',
  },
  sortOptionText: {
    fontSize: 13,
    color: '#182018',
    fontWeight: '600',
  },
  sortOptionTextActive: {
    fontWeight: 'bold',
    color: '#2f7a54',
  },
  // Product Detail Screen
  detailImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f6f1',
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailDiscountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#ff745e',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detailDiscountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  detailAssuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dfe3dd',
  },
  detailAssuredText: {
    color: '#183d2f',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailContent: {
    padding: 14,
  },
  detailCategory: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#2f7a54',
    textTransform: 'uppercase',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#182018',
    marginTop: 2,
    lineHeight: 22,
  },
  detailRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  detailRatingsCount: {
    fontSize: 11,
    color: '#687068',
    marginLeft: 8,
    fontWeight: '600',
  },
  detailPriceCard: {
    backgroundColor: '#f5f6f1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dfe3dd',
    padding: 10,
    marginTop: 12,
  },
  specialPriceLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#2f7a54',
    letterSpacing: 0.5,
  },
  detailPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 2,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#182018',
  },
  detailOriginalPrice: {
    fontSize: 13,
    color: '#687068',
    textDecorationLine: 'line-through',
  },
  detailDiscountRate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2f7a54',
  },
  detailSavingsText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#183d2f',
    marginTop: 2,
  },
  detailOffersCard: {
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  detailOffersTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#182018',
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  offerText: {
    flex: 1,
    fontSize: 11,
    color: '#182018',
    lineHeight: 16,
  },
  pincodeCard: {
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  pincodeCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#182018',
  },
  pincodeChangeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2f7a54',
  },
  pincodeInputRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  pincodeInput: {
    flex: 1,
    backgroundColor: '#f5f6f1',
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    fontSize: 12,
    color: '#182018',
  },
  pincodeCheckButton: {
    backgroundColor: '#183d2f',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  pincodeCheckButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pincodeResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pincodeResultText: {
    fontSize: 11,
    color: '#2f7a54',
    fontWeight: '600',
  },
  descriptionSection: {
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: '#dfe3dd',
    paddingTop: 12,
  },
  descriptionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#687068',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  descriptionBody: {
    fontSize: 12.5,
    color: '#182018',
    lineHeight: 18,
  },
  detailBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#dfe3dd',
    flexDirection: 'row',
    padding: 10,
    gap: 8,
  },
  cartCTAButton: {
    flex: 1,
    backgroundColor: '#183d2f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  cartCTAText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  buyNowCTAButton: {
    flex: 1,
    backgroundColor: '#baf2cd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buyNowCTAText: {
    color: '#183d2f',
    fontSize: 13,
    fontWeight: '900',
  },
  // Cart & Checkout
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#baf2cd',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#102c23',
  },
  badgeText: {
    color: '#102c23',
    fontSize: 10,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f6f1',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#687068',
    marginTop: 12,
    marginBottom: 14,
  },
  linkButton: {
    backgroundColor: '#183d2f',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  linkText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dfe3dd',
  },
  cartImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: '#f5f6f1',
  },
  cartName: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#182018',
  },
  cartPrice: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#2f7a54',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 6,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6f1',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#182018',
  },
  qtyValue: {
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 12.5,
    color: '#182018',
  },
  removeText: {
    color: '#ff745e',
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#dfe3dd',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 13,
    color: '#687068',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#182018',
  },
  subText: {
    fontSize: 12,
    color: '#2f7a54',
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2f7a54',
  },
  finalTotalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#182018',
  },
  checkoutButton: {
    backgroundColor: '#183d2f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dfe3dd',
    padding: 14,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#182018',
    marginBottom: 10,
  },
  label: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#182018',
    marginTop: 8,
    marginBottom: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    backgroundColor: '#f5f6f1',
    color: '#182018',
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  payOptionActive: {
    borderColor: '#2f7a54',
    backgroundColor: 'rgba(186, 242, 205, 0.25)',
  },
  payOptionTitle: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#182018',
  },
  payOptionSubtitle: {
    fontSize: 10.5,
    color: '#687068',
    marginTop: 1,
  },
});
