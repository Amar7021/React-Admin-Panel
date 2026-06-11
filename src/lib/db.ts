import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  serverTimestamp,
  Firestore
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  UserCredential
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, auth, storage, isFirebaseActive } from "./firebase";

// --- Types ---
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  status: "active" | "passive" | "pending";
  img?: string;
  timeStamp?: any;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  img?: string;
  timeStamp?: any;
}

export interface Transaction {
  id: string;
  product: string;
  img?: string;
  customer: string;
  date: string;
  amount: number;
  method: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface ActivityLog {
  id: string;
  message: string;
  time: string;
  type: "user" | "product" | "order" | "system";
}

export interface AppNotification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

// --- Initial Mock Data ---
const initialUsers: User[] = [
  {
    id: "user_1",
    username: "janedoe",
    displayName: "Jane Doe",
    email: "janedoe@gmail.com",
    phone: "+1 234 567 89",
    address: "Elton St. 234 Garden Yd. NewYork",
    country: "USA",
    status: "active",
    img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    timeStamp: new Date("2026-05-15").toISOString()
  },
  {
    id: "user_2",
    username: "johnsmith",
    displayName: "John Smith",
    email: "johnsmith@gmail.com",
    phone: "+1 345 678 90",
    address: "Broadway St. 12 NewYork",
    country: "USA",
    status: "active",
    img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=500",
    timeStamp: new Date("2026-06-01").toISOString()
  },
  {
    id: "user_3",
    username: "michaeldoe",
    displayName: "Michael Doe",
    email: "michaeldoe@gmail.com",
    phone: "+1 456 789 01",
    address: "Sunset Blvd 45 Los Angeles",
    country: "USA",
    status: "pending",
    img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=500",
    timeStamp: new Date("2026-06-05").toISOString()
  },
  {
    id: "user_4",
    username: "janesmith",
    displayName: "Jane Smith",
    email: "janesmith@gmail.com",
    phone: "+1 567 890 12",
    address: "Peachtree St. 78 Atlanta",
    country: "USA",
    status: "passive",
    img: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=500",
    timeStamp: new Date("2026-06-08").toISOString()
  },
  {
    id: "user_5",
    username: "haroldcarol",
    displayName: "Harold Carol",
    email: "haroldcarol@gmail.com",
    phone: "+1 678 901 23",
    address: "Michigan Ave 123 Chicago",
    country: "USA",
    status: "pending",
    img: "https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    timeStamp: new Date("2026-06-10").toISOString()
  }
];

const initialProducts: Product[] = [
  {
    id: "prod_1",
    title: "Acer Nitro 5",
    description: "High-performance gaming laptop with RTX graphics.",
    category: "Computers",
    price: 785,
    stock: 15,
    img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
    timeStamp: new Date("2026-05-10").toISOString()
  },
  {
    id: "prod_2",
    title: "Playstation 5",
    description: "Next-gen console with immersive gaming experience.",
    category: "Consoles",
    price: 499,
    stock: 8,
    img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
    timeStamp: new Date("2026-05-18").toISOString()
  },
  {
    id: "prod_3",
    title: "Redragon S101",
    description: "RGB Wired gaming keyboard and mouse combo.",
    category: "Accessories",
    price: 35,
    stock: 120,
    img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
    timeStamp: new Date("2026-06-01").toISOString()
  },
  {
    id: "prod_4",
    title: "Razer Blade 15",
    description: "Ultra-thin gaming laptop with premium design.",
    category: "Computers",
    price: 1999,
    stock: 5,
    img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
    timeStamp: new Date("2026-06-05").toISOString()
  },
  {
    id: "prod_5",
    title: "ASUS ROG Strix",
    description: "Top-tier gaming monitor with 240Hz refresh rate.",
    category: "Monitors",
    price: 450,
    stock: 22,
    img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
    timeStamp: new Date("2026-06-09").toISOString()
  }
];

const initialTransactions: Transaction[] = [
  {
    id: "1143155",
    product: "Acer Nitro 5",
    img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
    customer: "John Smith",
    date: "11 June 2026",
    amount: 785,
    method: "Cash on Delivery",
    status: "Approved",
  },
  {
    id: "2235235",
    product: "Playstation 5",
    img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
    customer: "Michael Doe",
    date: "10 June 2026",
    amount: 499,
    method: "Online Payment",
    status: "Pending",
  },
  {
    id: "2342353",
    product: "Redragon S101",
    img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
    customer: "John Smith",
    date: "09 June 2026",
    amount: 35,
    method: "Cash on Delivery",
    status: "Pending",
  },
  {
    id: "2357741",
    product: "Razer Blade 15",
    img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
    customer: "Jane Smith",
    date: "08 June 2026",
    amount: 1999,
    method: "Online",
    status: "Approved",
  },
  {
    id: "2342355",
    product: "ASUS ROG Strix",
    img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
    customer: "Harold Carol",
    date: "07 June 2026",
    amount: 450,
    method: "Online",
    status: "Pending",
  },
];

const initialLogs: ActivityLog[] = [
  { id: "log_1", message: "System started up successfully", time: "1 hour ago", type: "system" },
  { id: "log_2", message: "Jane Doe updated profile image", time: "2 hours ago", type: "user" },
  { id: "log_3", message: "New product ASUS ROG Strix added", time: "3 hours ago", type: "product" },
  { id: "log_4", message: "Order 2357741 marked as Approved", time: "5 hours ago", type: "order" }
];

const initialNotifications: AppNotification[] = [
  { id: "not_1", message: "New user registered: Harold Carol", time: "2 hours ago", read: false },
  { id: "not_2", message: "Low stock alert: Razer Blade 15 (5 left)", time: "4 hours ago", read: false },
  { id: "not_3", message: "Monthly report is ready for download", time: "1 day ago", read: true }
];

// --- Mock Database ---
type Listener = () => void;
const userListeners = new Set<Listener>();
const productListeners = new Set<Listener>();
const transactionListeners = new Set<Listener>();
const logListeners = new Set<Listener>();
const notificationListeners = new Set<Listener>();

const notify = (listeners: Set<Listener>) => {
  listeners.forEach(l => {
    try { l(); } catch (e) { console.error("Listener failed", e); }
  });
};

// --- Storage Utilities ---
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage write error", err);
  }
};

// --- Initializing Local Databases if missing ---
if (!localStorage.getItem("admin_users")) setStorageItem("admin_users", initialUsers);
if (!localStorage.getItem("admin_products")) setStorageItem("admin_products", initialProducts);
if (!localStorage.getItem("admin_transactions")) setStorageItem("admin_transactions", initialTransactions);
if (!localStorage.getItem("admin_logs")) setStorageItem("admin_logs", initialLogs);
if (!localStorage.getItem("admin_notifications")) setStorageItem("admin_notifications", initialNotifications);

// --- Database Interface Service ---
export const dbService = {
  // --- AUTH SERVICES ---
  async signIn(email: string, password: string): Promise<any> {
    if (isFirebaseActive && auth) {
      const creds = await signInWithEmailAndPassword(auth, email, password);
      return creds.user;
    } else {
      // Simulate local sign in
      if (email === "admin@admin.com" && password === "admin123") {
        return {
          uid: "mock_admin_1",
          email: "admin@admin.com",
          displayName: "Super Admin",
          photoURL: "https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
        };
      } else if (email.startsWith("user@") && password.length >= 6) {
        return {
          uid: "mock_user_" + Date.now(),
          email: email,
          displayName: "Standard User",
          photoURL: ""
        };
      }
      throw new Error("Invalid email or password. Use email 'admin@admin.com' and password 'admin123' for simulated mode.");
    }
  },

  async resetPassword(email: string): Promise<void> {
    if (isFirebaseActive && auth) {
      await sendPasswordResetEmail(
        auth,
        email
      );
      return;
    }

    console.log(
      `Password reset simulated for ${email}`
    );
  },

  async signOut(): Promise<void> {
    if (isFirebaseActive && auth) {
      await firebaseSignOut(auth);
    }
  },

  // --- USERS SERVICES ---
  listenUsers(callback: (users: User[]) => void): () => void {
    if (isFirebaseActive && db) {
      return onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          const list: User[] = [];
          snapshot.docs.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as User);
          });
          callback(list);
        },
        (error) => {
          console.error("Firebase fetch error, falling back to local users", error);
          callback(getStorageItem<User[]>("admin_users", []));
        }
      );
    } else {
      // Local Mock DB
      const handler = () => {
        callback(getStorageItem<User[]>("admin_users", []));
      };
      userListeners.add(handler);
      handler(); // Initial trigger
      return () => {
        userListeners.delete(handler);
      };
    }
  },

  async addUser(userData: Omit<User, "id">, fileImage?: File): Promise<User> {
    const timeStampVal = isFirebaseActive ? serverTimestamp() : new Date().toISOString();
    let downloadURL = "";

    // Upload Image file if provided
    if (fileImage) {
      if (isFirebaseActive && storage) {
        const storageRef = ref(storage, `images/${Date.now()}_${fileImage.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, fileImage);
        downloadURL = await getDownloadURL(uploadTask.ref);
      } else {
        // Mock FileReader conversion
        downloadURL = URL.createObjectURL(fileImage);
      }
    }

    if (isFirebaseActive && db && auth) {
      // Create user auth in Firebase
      const res = await createUserWithEmailAndPassword(auth, userData.email, (userData as any).password || "password123");
      const record = {
        username: userData.username,
        displayName: userData.displayName,
        email: userData.email,
        phone: userData.phone || "",
        address: userData.address || "",
        country: userData.country || "",
        status: userData.status,
        img: downloadURL || userData.img || "",
        timeStamp: timeStampVal
      };
      await setDoc(doc(db, "users", res.user.uid), record);
      const createdUser = { id: res.user.uid, ...record };
      dbService.addLog(`User ${createdUser.displayName} was created`, "user");
      return createdUser;
    } else {
      // Local storage write
      const mockUsers = getStorageItem<User[]>("admin_users", []);
      const newUser: User = {
        id: "user_" + Date.now(),
        ...userData,
        img: downloadURL || userData.img || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg",
        timeStamp: timeStampVal
      };
      // Strip password for safety
      delete (newUser as any).password;
      mockUsers.unshift(newUser);
      setStorageItem("admin_users", mockUsers);
      notify(userListeners);
      dbService.addLog(`User ${newUser.displayName} was created (Local)`, "user");
      return newUser;
    }
  },

  async deleteUser(id: string): Promise<void> {
    if (isFirebaseActive && db) {
      await deleteDoc(doc(db, "users", id));
      dbService.addLog(`User record ${id} was deleted`, "user");
    } else {
      const mockUsers = getStorageItem<User[]>("admin_users", []);
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        const name = mockUsers[index].displayName;
        mockUsers.splice(index, 1);
        setStorageItem("admin_users", mockUsers);
        notify(userListeners);
        dbService.addLog(`User ${name} was deleted (Local)`, "user");
      }
    }
  },

  // --- PRODUCTS SERVICES ---
  listenProducts(callback: (products: Product[]) => void): () => void {
    if (isFirebaseActive && db) {
      return onSnapshot(
        collection(db, "products"),
        (snapshot) => {
          const list: Product[] = [];
          snapshot.docs.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Product);
          });
          callback(list);
        },
        (error) => {
          console.error("Firebase fetch error, falling back to local products", error);
          callback(getStorageItem<Product[]>("admin_products", []));
        }
      );
    } else {
      // Local Mock DB
      const handler = () => {
        callback(getStorageItem<Product[]>("admin_products", []));
      };
      productListeners.add(handler);
      handler();
      return () => {
        productListeners.delete(handler);
      };
    }
  },

  async addProduct(productData: Omit<Product, "id">, fileImage?: File): Promise<Product> {
    const timeStampVal = isFirebaseActive ? serverTimestamp() : new Date().toISOString();
    let downloadURL = "";

    if (fileImage) {
      if (isFirebaseActive && storage) {
        const storageRef = ref(storage, `products/${Date.now()}_${fileImage.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, fileImage);
        downloadURL = await getDownloadURL(uploadTask.ref);
      } else {
        downloadURL = URL.createObjectURL(fileImage);
      }
    }

    const record = {
      title: productData.title,
      description: productData.description || "",
      category: productData.category,
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
      img: downloadURL || productData.img || "",
      timeStamp: timeStampVal
    };

    if (isFirebaseActive && db) {
      const newDocRef = doc(collection(db, "products"));
      await setDoc(newDocRef, record);
      const createdProd = { id: newDocRef.id, ...record };
      dbService.addLog(`Product ${createdProd.title} was created`, "product");
      return createdProd;
    } else {
      const mockProds = getStorageItem<Product[]>("admin_products", []);
      const newProduct: Product = {
        id: "prod_" + Date.now(),
        ...record,
        img: downloadURL || productData.img || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg",
      };
      mockProds.unshift(newProduct);
      setStorageItem("admin_products", mockProds);
      notify(productListeners);
      dbService.addLog(`Product ${newProduct.title} was created (Local)`, "product");
      return newProduct;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    if (isFirebaseActive && db) {
      await deleteDoc(doc(db, "products", id));
      dbService.addLog(`Product record ${id} was deleted`, "product");
    } else {
      const mockProds = getStorageItem<Product[]>("admin_products", []);
      const index = mockProds.findIndex(p => p.id === id);
      if (index !== -1) {
        const title = mockProds[index].title;
        mockProds.splice(index, 1);
        setStorageItem("admin_products", mockProds);
        notify(productListeners);
        dbService.addLog(`Product ${title} was deleted (Local)`, "product");
      }
    }
  },

  // --- TRANSACTIONS / ORDERS SERVICES ---
  listenTransactions(callback: (txs: Transaction[]) => void): () => void {
    const handler = () => {
      callback(getStorageItem<Transaction[]>("admin_transactions", []));
    };
    transactionListeners.add(handler);
    handler();
    return () => {
      transactionListeners.delete(handler);
    };
  },

  // --- STATS & COUNTERS SERVICES ---
  async getStatsSummary(type: "user" | "product" | "order" | "earning"): Promise<{ amount: number; diff: number }> {
    try {
      if (isFirebaseActive && db && (type === "user" || type === "product")) {
        const colName = type === "user" ? "users" : "products";
        const today = new Date();
        const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
        const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

        const lastMonthQuery = query(
          collection(db, colName),
          where("timeStamp", "<=", today),
          where("timeStamp", ">", lastMonth)
        );
        const prevMonthQuery = query(
          collection(db, colName),
          where("timeStamp", "<=", lastMonth),
          where("timeStamp", ">", prevMonth)
        );

        const lastMonthData = await getDocs(lastMonthQuery);
        const prevMonthData = await getDocs(prevMonthQuery);

        const amount = lastMonthData.docs.length;
        const prevAmount = prevMonthData.docs.length;
        const diff = prevAmount === 0 ? amount * 100 : ((amount - prevAmount) / prevAmount) * 100;

        return { amount, diff: parseFloat(diff.toFixed(1)) };
      }
    } catch (err) {
      console.warn(`Firebase query failed for stats ${type}, falling back to mock counts`, err);
    }

    // Default mock stats calculation
    switch (type) {
      case "user": {
        const users = getStorageItem<User[]>("admin_users", []);
        return { amount: users.length, diff: 11.4 };
      }
      case "product": {
        const products = getStorageItem<Product[]>("admin_products", []);
        return { amount: products.length, diff: 5.2 };
      }
      case "order": {
        const txs = getStorageItem<Transaction[]>("admin_transactions", []);
        return { amount: txs.length, diff: -2.1 };
      }
      case "earning": {
        const txs = getStorageItem<Transaction[]>("admin_transactions", []);
        const earnings = txs.reduce((acc, curr) => acc + (curr.status === "Approved" ? curr.amount : 0), 0);
        return { amount: earnings, diff: 12.8 };
      }
      default:
        return { amount: 0, diff: 0 };
    }
  },

  // --- LOGGING SERVICES ---
  listenLogs(callback: (logs: ActivityLog[]) => void): () => void {
    const handler = () => {
      callback(getStorageItem<ActivityLog[]>("admin_logs", []));
    };
    logListeners.add(handler);
    handler();
    return () => {
      logListeners.delete(handler);
    };
  },

  addLog(message: string, type: ActivityLog["type"] = "system"): void {
    const logs = getStorageItem<ActivityLog[]>("admin_logs", []);
    const newLog: ActivityLog = {
      id: "log_" + Date.now(),
      message,
      time: "Just now",
      type
    };
    logs.unshift(newLog);
    setStorageItem("admin_logs", logs.slice(0, 50)); // Keep last 50 logs
    notify(logListeners);
  },

  // --- NOTIFICATIONS SERVICES ---
  listenNotifications(callback: (nots: AppNotification[]) => void): () => void {
    const handler = () => {
      callback(getStorageItem<AppNotification[]>("admin_notifications", []));
    };
    notificationListeners.add(handler);
    handler();
    return () => {
      notificationListeners.delete(handler);
    };
  },

  addNotification(message: string): void {
    const nots = getStorageItem<AppNotification[]>("admin_notifications", []);
    const newNot: AppNotification = {
      id: "not_" + Date.now(),
      message,
      time: "Just now",
      read: false
    };
    nots.unshift(newNot);
    setStorageItem("admin_notifications", nots.slice(0, 20));
    notify(notificationListeners);
  },

  markNotificationsRead(): void {
    const nots = getStorageItem<AppNotification[]>("admin_notifications", []);
    const updated = nots.map(n => ({ ...n, read: true }));
    setStorageItem("admin_notifications", updated);
    notify(notificationListeners);
  }
};
