import Notification from '../models/Notification.js';

export const notifyUser = async ({ user, type, title, message, order = null }) => {
  if (!user || !type || !title || !message) return null;
  return Notification.create({ user, type, title: String(title).trim().slice(0, 160), message: String(message).trim().slice(0, 1000), order });
};

export const notifyOrderCreated = (order) => notifyUser({ user: order.user, type: 'order', title: 'Order confirmed', message: `Your order ${order.orderNumber} has been confirmed with Cash on Delivery.`, order: order._id });
export const notifyOrderStatusChanged = (order, previousStatus) => {
  if (!order || order.status === previousStatus) return null;
  const labels = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };
  const statusLabel = labels[order.status] || order.status;
  return notifyUser({ user: order.user, type: 'order', title: `Order ${statusLabel}`, message: `Your order ${order.orderNumber} is now ${statusLabel.toLowerCase()}.`, order: order._id });
};
export const notifyOrderCancelled = (order) => notifyUser({ user: order.user, type: 'order', title: 'Order cancelled', message: `Your order ${order.orderNumber} has been cancelled.`, order: order._id });
export const notifyPaymentPaid = (order) => notifyUser({ user: order.user, type: 'payment', title: 'Payment confirmed', message: `Payment for order ${order.orderNumber} was confirmed successfully.`, order: order._id });
export const notifyPaymentFailed = (order) => notifyUser({ user: order.user, type: 'payment', title: 'Payment failed', message: `Payment for order ${order.orderNumber} failed. You can retry payment from your order page.`, order: order._id });
