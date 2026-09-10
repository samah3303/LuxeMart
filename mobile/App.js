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
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

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

// Initial / Fallback Dropship Catalog in INR
const initialProducts = [
  {
    id: '1',
    name: 'Automatic Rechargeable Water Can Dispenser',
    price: 799,
    category: 'Kitchen & Home',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
  },
  {
    id: '2',
    name: '12-in-1 Multi-Blade Vegetable Chopper',
    price: 899,
    category: 'Kitchen & Home',
    image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&q=80',
  },
  {
    id: '3',
    name: 'Embroidered Pure Cotton Kurti',
    price: 1199,
    category: 'Fashion & Ethnic',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  },
  {
    id: '4',
    name: 'Solar Rotating Kinetic Car Aroma Diffuser',
    price: 599,
    category: 'Car Gadgets',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80',
  },
];

// --- Navbar Cart Icon ---
function CartIcon() {
  const navigation = useNavigation();
  const { cartCount } = useCart();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ padding: 5 }}>
      <Ionicons name="cart-outline" size={24} color="#ffffff" />
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// --- Home Screen ---
function HomeScreen() {
  const { addToCart } = useCart();
  const [productList, setProductList] = React.useState(initialProducts);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Attempt to fetch from local Next.js server
    fetch('http://192.168.1.196:3000/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products?.length > 0) {
          setProductList(data.products);
        }
      })
      .catch(() => {
        // Keeps initialProducts on network error
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.categoryBadge}>{item.category || 'Trending'}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.deliveryBadge}>Free Express Delivery</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Banner */}
      <View style={styles.promoBanner}>
        <Text style={styles.promoText}>⚡ Flat ₹70 OFF via UPI &bull; Fast Express Delivery</Text>
      </View>
      <FlatList
        data={productList}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

// --- Cart Screen ---
function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const shipping = cartTotal > 499 ? 0 : 79;
  const upiDiscount = 70;
  const finalTotal = Math.max(0, cartTotal + shipping - upiDiscount);

  if (cart.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cart-outline" size={64} color="#94a3b8" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Explore Trending Deals</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
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
          <Text style={styles.subText}>UPI Discount:</Text>
          <Text style={styles.discountText}>- ₹{upiDiscount}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payable:</Text>
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
  const { clearCart, cartTotal } = useCart();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [house, setHouse] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [pincode, setPincode] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('UPI');

  const finalAmount = Math.max(0, cartTotal - (paymentMethod === 'UPI' ? 70 : 0));

  const handlePlaceOrder = () => {
    if (!name.trim() || !phone.trim() || !house.trim() || !pincode.trim()) {
      Alert.alert('Missing Details', 'Please fill in Name, Phone, House Name, and PIN code.');
      return;
    }

    Alert.alert(
      'Order Confirmed! 🎉',
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
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>Delivery Details</Text>

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
            <Text style={styles.payOptionSubtitle}>Pay at doorstep</Text>
          </View>
        </TouchableOpacity>

        <View style={{ marginTop: 16, borderTopWidth: 1, borderColor: '#dfe3dd', paddingTop: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#182018' }}>
            Total Payable: ₹{finalAmount}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handlePlaceOrder}>
        <Text style={styles.checkoutButtonText}>Confirm & Place Order</Text>
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
            headerTitleStyle: { fontWeight: '900' },
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
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
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
    padding: 16,
    backgroundColor: '#f5f6f1',
  },
  list: {
    padding: 16,
  },
  promoBanner: {
    backgroundColor: '#183d2f',
    paddingVertical: 9,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2f7a54',
  },
  promoText: {
    color: '#baf2cd',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dfe3dd',
    padding: 14,
    shadowColor: '#1f3127',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: '#f5f6f1',
  },
  info: {
    marginTop: 10,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2f7a54',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#182018',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: '#182018',
  },
  deliveryBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#183d2f',
    backgroundColor: '#baf2cd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#183d2f',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
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
    padding: 20,
    backgroundColor: '#f5f6f1',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#687068',
    marginTop: 16,
    marginBottom: 16,
  },
  linkButton: {
    backgroundColor: '#183d2f',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
  },
  linkText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dfe3dd',
  },
  cartImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#f5f6f1',
  },
  cartName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#182018',
  },
  cartPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2f7a54',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6f1',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#182018',
  },
  qtyValue: {
    marginHorizontal: 12,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#182018',
  },
  removeText: {
    color: '#ff745e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#dfe3dd',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: '#687068',
  },
  totalValue: {
    fontSize: 15,
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
    fontSize: 18,
    fontWeight: '900',
    color: '#182018',
  },
  checkoutButton: {
    backgroundColor: '#183d2f',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#182018',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#182018',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#f5f6f1',
    color: '#182018',
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  payOptionActive: {
    borderColor: '#2f7a54',
    backgroundColor: 'rgba(186, 242, 205, 0.25)',
  },
  payOptionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#182018',
  },
  payOptionSubtitle: {
    fontSize: 11,
    color: '#687068',
    marginTop: 2,
  },
});
