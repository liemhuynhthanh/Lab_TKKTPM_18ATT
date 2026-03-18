package org.example;
interface ActionStrategy {
    void execute();
}

// Kiểm tra đơn hàng
class CheckOrderStrategy implements ActionStrategy {
    @Override
    public void execute() {
        System.out.println("Kiểm tra thông tin đơn hàng...");
    }
}

// Vận chuyển
class ShippingStrategy implements ActionStrategy {
    @Override
    public void execute() {
        System.out.println("Đóng gói và vận chuyển...");
    }
}

// Hoàn tiền
class RefundStrategy implements ActionStrategy {
    @Override
    public void execute() {
        System.out.println("Hoàn tiền cho khách hàng...");
    }
}
interface Action {
    void perform();
}

// Hành động cơ bản
class BasicAction implements Action {
    @Override
    public void perform() {
        System.out.println("Thực hiện hành động chính...");
    }
}

// Decorator trừu tượng
abstract class ActionDecorator implements Action {
    protected Action wrappee;

    public ActionDecorator(Action action) {
        this.wrappee = action;
    }
}

// Logging
class LoggingDecorator extends ActionDecorator {

    public LoggingDecorator(Action action) {
        super(action);
    }

    @Override
    public void perform() {
        System.out.println("[LOG] Bắt đầu xử lý...");
        wrappee.perform();
    }
}

// Notification
class NotificationDecorator extends ActionDecorator {

    public NotificationDecorator(Action action) {
        super(action);
    }

    @Override
    public void perform() {
        wrappee.perform();
        System.out.println("[NOTIFY] Đã gửi thông báo!");
    }
}

interface OrderState {
    void handle(OrderContext context);
}

// Mới tạo
class NewState implements OrderState {
    @Override
    public void handle(OrderContext context) {
        System.out.println("Trạng thái: Mới tạo");

        context.setStrategy(new CheckOrderStrategy());
        context.getStrategy().execute();

        context.setState(new ProcessingState());
    }
}

// Đang xử lý
class ProcessingState implements OrderState {
    @Override
    public void handle(OrderContext context) {
        System.out.println("Trạng thái: Đang xử lý");

        context.setStrategy(new ShippingStrategy());
        context.getStrategy().execute();

        context.setState(new DeliveredState());
    }
}

// Đã giao
class DeliveredState implements OrderState {
    @Override
    public void handle(OrderContext context) {
        System.out.println("Trạng thái: Đã giao");
        System.out.println("Đơn hàng đã giao thành công!");
    }
}

// Hủy
class CancelledState implements OrderState {
    @Override
    public void handle(OrderContext context) {
        System.out.println("Trạng thái: Hủy");

        context.setStrategy(new RefundStrategy());
        context.getStrategy().execute();
    }
}

class OrderContext {
    private OrderState state;
    private ActionStrategy strategy;

    public OrderContext(OrderState state) {
        this.state = state;
    }

    public void setState(OrderState state) {
        this.state = state;
    }

    public void setStrategy(ActionStrategy strategy) {
        this.strategy = strategy;
    }

    public ActionStrategy getStrategy() {
        return strategy;
    }

    public void request() {
        state.handle(this);
    }
}

public class Main {
    public static void main(String[] args) {

        // Decorator demo
        Action action = new NotificationDecorator(
                new LoggingDecorator(
                        new BasicAction()
                )
        );

        action.perform();

        System.out.println("------------------");

        // State + Strategy demo
        OrderContext order = new OrderContext(new NewState());

        order.request(); // New -> Processing
        System.out.println("------------------");

        order.request(); // Processing -> Delivered
        System.out.println("------------------");

        order.request(); // Delivered
    }
}