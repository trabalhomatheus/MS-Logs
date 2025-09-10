const Logs = require('../models/logs');

const toProto = (doc) => ({
  id: doc._id.toString(),
  service: doc.service,
  message: doc.message,
  user: doc.user,
  timestamp: doc.timestamp ? doc.timestamp.toISOString() : null,
  log: typeof doc.log === 'object' ? JSON.stringify(doc.log) : (doc.log || '{}')
});

module.exports = {
  async CreateLog(call, callback) {
    try {
      console.log('=== CreateLog Request ===');
      console.log('Raw request log field:', call.request.log);
      console.log('Type of log field:', typeof call.request.log);
      
      let logObject = {};
      
      if (!call.request.log) {
        logObject = {};
      } 
      else if (typeof call.request.log === 'string') {
        if (call.request.log === '[object Object]') {
          console.log('Detected [object Object] - using empty object fallback');
          logObject = {};
        } else {
          try {
            logObject = JSON.parse(call.request.log);
            console.log('Successfully parsed JSON string:', logObject);
          } catch (parseError) {
            console.error('JSON parse error:', parseError.message);
            logObject = { raw_log: call.request.log };
          }
        }
      } 
      else if (typeof call.request.log === 'object') {
        logObject = call.request.log;
        console.log('Log received as object:', logObject);
      }

      const logData = {
        service: call.request.service,
        message: call.request.message,
        user: call.request.user,
        log: logObject
      };

      console.log('Final data to save:', logData);

      const log = new Logs(logData);
      await log.save();

      console.log('✅ Log saved successfully with ID:', log._id);

      callback(null, { log: toProto(log) });
    } catch (err) {
      console.error('❌ CreateLog error:', err);
      callback(new Error('CreateLog failed: ' + err.message));
    }
  },

  async ListLogs(call, callback) {
    try {
      console.log('=== ListLogs Request ===');
      console.log('Request params:', {
        page: call.request.page,
        limit: call.request.limit
      });

      const page = Math.max(1, call.request.page || 1);
      const limit = Math.min(Math.max(1, call.request.limit || 10), 100);
      const skip = (page - 1) * limit;

      const logs = await Logs.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Logs.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;


      callback(null, { 
        logs: logs.map(toProto),
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev
      });
    } catch (err) {
      console.error('ListLogs error:', err);
      callback(err);
    }
  }
};