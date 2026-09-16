// Test-only environment defaults. Never use these values for development or production services.
process.env.NODE_ENV ||= 'test';
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/royal-store-v2-test';
process.env.JWT_SECRET ||= 'royal-store-v2-test-jwt-secret-not-for-production';
process.env.RAZORPAY_KEY_SECRET ||= 'test-razorpay-secret';
process.env.RAZORPAY_WEBHOOK_SECRET ||= 'test-webhook-secret';
