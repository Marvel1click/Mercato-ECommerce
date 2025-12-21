import { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { useAddresses } from '../hooks/useAddresses';
import { useWishlist } from '../contexts/WishlistContext';
import { useUI } from '../contexts/UIContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

interface AccountPageProps {
  onNavigate: (page: string) => void;
  section?: string;
}

export default function AccountPage({ onNavigate, section = 'overview' }: AccountPageProps) {
  const { user, profile, signOut, updateProfile } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  const { addresses, addAddress, updateAddress, deleteAddress, loading: addressesLoading } = useAddresses();
  const { items: wishlistItems } = useWishlist();
  const { showToast, setAuthModalOpen } = useUI();

  const [activeSection, setActiveSection] = useState(section);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your account</h2>
          <p className="text-gray-500 mb-6">Access your orders, addresses, and more</p>
          <Button onClick={() => setAuthModalOpen(true)}>Sign In</Button>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out successfully');
    onNavigate('home');
  };

  const handleUpdateProfile = async () => {
    const { error } = await updateProfile({
      full_name: profileForm.fullName,
      phone: profileForm.phone,
    });

    if (error) {
      showToast('Failed to update profile', 'error');
    } else {
      showToast('Profile updated successfully');
      setIsEditingProfile(false);
    }
  };

  const handleSaveAddress = async () => {
    const addressData = {
      first_name: addressForm.firstName,
      last_name: addressForm.lastName,
      street: addressForm.street,
      apartment: addressForm.apartment || null,
      city: addressForm.city,
      state: addressForm.state,
      zip_code: addressForm.zipCode,
      country: addressForm.country,
      phone: addressForm.phone || null,
      is_default: addressForm.isDefault,
      type: 'shipping' as const,
    };

    if (editingAddress) {
      await updateAddress(editingAddress, addressData);
      showToast('Address updated');
    } else {
      await addAddress(addressData);
      showToast('Address added');
    }

    setAddressModalOpen(false);
    setEditingAddress(null);
    setAddressForm({
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      isDefault: false,
    });
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'info' | 'warning' | 'success' | 'error'> = {
      pending: 'warning',
      processing: 'info',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'error',
    };
    return <Badge variant={variants[status] || 'info'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container-custom">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-terracotta-600">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="font-semibold text-gray-900">
                  {profile?.full_name || 'User'}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-terracotta-50 text-terracotta-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Account Overview</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-cream-50 rounded-lg p-4">
                      <Package className="w-8 h-8 text-terracotta-500 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                      <p className="text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-cream-50 rounded-lg p-4">
                      <Heart className="w-8 h-8 text-terracotta-500 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
                      <p className="text-gray-600">Wishlist Items</p>
                    </div>
                    <div className="bg-cream-50 rounded-lg p-4">
                      <MapPin className="w-8 h-8 text-terracotta-500 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
                      <p className="text-gray-600">Saved Addresses</p>
                    </div>
                  </div>
                </div>

                {orders.length > 0 && (
                  <div className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                      <button
                        onClick={() => setActiveSection('orders')}
                        className="text-terracotta-600 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">#{order.order_number}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="font-medium mt-1">${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
                {ordersLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded-lg" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate('products')}
                      className="mt-4"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Order #{order.order_number}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex-shrink-0">
                              <img
                                src={item.product_image || ''}
                                alt={item.product_name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <p className="font-medium">
                            Total: ${order.total.toFixed(2)}
                          </p>
                          <button className="text-terracotta-600 font-medium flex items-center gap-1">
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'addresses' && (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                  <Button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({
                        firstName: '',
                        lastName: '',
                        street: '',
                        apartment: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: 'United States',
                        phone: '',
                        isDefault: false,
                      });
                      setAddressModalOpen(true);
                    }}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Address
                  </Button>
                </div>

                {addressesLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-32 bg-gray-100 rounded-lg" />
                    ))}
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved addresses</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 relative ${
                          address.is_default ? 'border-terracotta-500 bg-terracotta-50' : 'border-gray-200'
                        }`}
                      >
                        {address.is_default && (
                          <Badge variant="primary" size="sm" className="absolute top-2 right-2">
                            Default
                          </Badge>
                        )}
                        <p className="font-medium text-gray-900">
                          {address.first_name} {address.last_name}
                        </p>
                        <p className="text-gray-600 mt-1">
                          {address.street}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                        {address.phone && (
                          <p className="text-gray-500 text-sm mt-2">{address.phone}</p>
                        )}
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => {
                              setEditingAddress(address.id);
                              setAddressForm({
                                firstName: address.first_name,
                                lastName: address.last_name,
                                street: address.street,
                                apartment: address.apartment || '',
                                city: address.city,
                                state: address.state,
                                zipCode: address.zip_code,
                                country: address.country,
                                phone: address.phone || '',
                                isDefault: address.is_default,
                              });
                              setAddressModalOpen(true);
                            }}
                            className="text-sm text-terracotta-600 flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              deleteAddress(address.id);
                              showToast('Address deleted');
                            }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate('products')}
                      className="mt-4"
                    >
                      Explore Products
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => onNavigate('wishlist')}>
                    View Full Wishlist ({wishlistItems.length} items)
                  </Button>
                )}
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Profile Information</h3>
                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="text-terracotta-600 text-sm font-medium"
                      >
                        {isEditingProfile ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    {isEditingProfile ? (
                      <div className="space-y-4">
                        <Input
                          label="Full Name"
                          value={profileForm.fullName}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, fullName: e.target.value })
                          }
                        />
                        <Input
                          label="Phone"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                        />
                        <Button onClick={handleUpdateProfile}>Save Changes</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="text-gray-500">Name:</span>{' '}
                          {profile?.full_name || 'Not set'}
                        </p>
                        <p className="text-gray-600">
                          <span className="text-gray-500">Email:</span> {user.email}
                        </p>
                        <p className="text-gray-600">
                          <span className="text-gray-500">Phone:</span>{' '}
                          {profile?.phone || 'Not set'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setAddressModalOpen(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={addressForm.firstName}
              onChange={(e) =>
                setAddressForm({ ...addressForm, firstName: e.target.value })
              }
              required
            />
            <Input
              label="Last Name"
              value={addressForm.lastName}
              onChange={(e) =>
                setAddressForm({ ...addressForm, lastName: e.target.value })
              }
              required
            />
          </div>
          <Input
            label="Street Address"
            value={addressForm.street}
            onChange={(e) =>
              setAddressForm({ ...addressForm, street: e.target.value })
            }
            required
          />
          <Input
            label="Apartment, suite, etc. (optional)"
            value={addressForm.apartment}
            onChange={(e) =>
              setAddressForm({ ...addressForm, apartment: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
              required
            />
            <Input
              label="State"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
              required
            />
          </div>
          <Input
            label="ZIP Code"
            value={addressForm.zipCode}
            onChange={(e) =>
              setAddressForm({ ...addressForm, zipCode: e.target.value })
            }
            required
          />
          <Input
            label="Phone (optional)"
            value={addressForm.phone}
            onChange={(e) =>
              setAddressForm({ ...addressForm, phone: e.target.value })
            }
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-terracotta-500"
            />
            <span className="text-sm text-gray-600">Set as default address</span>
          </label>
          <Button onClick={handleSaveAddress} className="w-full">
            {editingAddress ? 'Update Address' : 'Save Address'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
