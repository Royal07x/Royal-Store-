import Notification from '../models/Notification.js';

export const notifyUser = async ({ user, type, title, message, order = null }) => {
  if (!user || !type || !title || !message) return null;
  return Notification.create({ user, type, title: String(title).trim().slice(0, 160), message: String(message).trim().slice(0, 1000), order });
};

export const notifyOrderCreated = (order) => notifyUser({ user: order.user, type: 'order', title: 'Order created', message: `Your order ${order.orderNumber} has been created and is awaiting payment.`, order: order._id });
export const notifyOrderCancelled = (order) => notifyUser({ user: order.user, type: 'order', title: 'Order cancelled', message: `Your order ${order.orderNumber} has been cancelled.`, order: order._id });
export const notifyPaymentPaid = (order) => notifyUser({ user: order.user, type: 'payment', title: 'Payment confirmed', message: `Payment for order ${order.orderNumber} was confirmed successfully.`, order: order._id });
export const notifyPaymentFailed = (order) => notifyUser({ user: order.user, type: 'payment', title: 'Payment failed', message: `Payment for order ${order.orderNumber} failed. You can retry payment from your order page.`, order: order._id });
