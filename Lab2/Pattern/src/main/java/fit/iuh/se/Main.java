// ==========================================
// 1. PRODUCT (Các sản phẩm do Factory tạo ra)
// ==========================================

// Giao diện chung cho mọi loại thông báo
interface Notification {
    void send(String message);
}

// Thông báo đẩy trên ứng dụng
class PushNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Gửi Push Notification tới thiết bị: " + message);
    }
}

// Thông báo qua tin nhắn điện thoại
class SMSNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Gửi SMS tới số điện thoại: " + message);
    }
}

// ==========================================
// 2. CREATOR + SINGLETON (Nhà máy duy nhất)
// ==========================================
class NotificationFactory {

    // Thuộc tính static volatile để chứa instance duy nhất (Singleton)
    private static volatile NotificationFactory instance;

    // Constructor private chặn việc dùng từ khóa 'new' từ bên ngoài (Singleton)
    private NotificationFactory() {
        System.out.println("-> Khởi tạo NotificationFactory (Chỉ chạy 1 lần).");
    }

    // Phương thức truy cập toàn cục với Double-Checked Locking (Singleton)
    public static NotificationFactory getInstance() {
        if (instance == null) {
            synchronized (NotificationFactory.class) {
                if (instance == null) {
                    instance = new NotificationFactory();
                }
            }
        }
        return instance;
    }

    // Phương thức tạo đối tượng (Factory Method)
    public Notification createNotification(String type) {
        if (type == null) {
            return null;
        }
        if (type.equalsIgnoreCase("PUSH")) {
            return new PushNotification();
        } else if (type.equalsIgnoreCase("SMS")) {
            return new SMSNotification();
        }
        throw new IllegalArgumentException("Loại thông báo không hợp lệ: " + type);
    }
}

// ==========================================
// 3. CLIENT (Nơi chạy thử)
// ==========================================
public class Main {
    public static void main(String[] args) {
        // Lấy ra nhà máy sản xuất thông báo (chỉ lấy được 1 instance duy nhất)
        NotificationFactory factory = NotificationFactory.getInstance();

        // Sử dụng Factory để tạo ra các loại thông báo khác nhau
        Notification push = factory.createNotification("PUSH");
        push.send("Bạn có tin nhắn mới từ nhóm Dự án!");

        Notification sms = factory.createNotification("SMS");
        sms.send("Mã OTP của bạn là 123456.");

        // Kiểm tra tính chất Singleton
        NotificationFactory anotherFactory = NotificationFactory.getInstance();
        System.out.println("\nHai biến factory có trỏ về cùng 1 nhà máy không? " + (factory == anotherFactory));
    }
}