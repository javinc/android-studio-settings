 package com.dileepindia.cordova.sms;
 
 import java.io.StringWriter;
import java.lang.reflect.Array;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.TimeZone;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.PendingIntent;
import android.app.PendingIntent.CanceledException;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Telephony;
import android.telephony.SmsManager;
import android.telephony.SmsMessage;
import android.text.format.DateFormat;
import android.util.Log;
import android.util.TimeUtils;




import android.view.Gravity;
import android.widget.TextView;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
 
/*   Product Developed by DILEEP YADAV for Go Processing Limited    */ 
 
 public class SMSPlugin extends CordovaPlugin
 
            {
   private static final String LOGTAG = "SMSPlugin";
   public static final String ACTION_SET_OPTIONS = "setOptions";
   private static final String ACTION_START_WATCH = "startWatch";
   private static final String ACTION_STOP_WATCH = "stopWatch";
   private static final String ACTION_ENABLE_INTERCEPT = "enableIntercept";
   private static final String ACTION_LIST_SMS = "listSMS";
   private static final String ACTION_DELETE_SMS = "deleteSMS";
   private static final String ACTION_RESTORE_SMS = "restoreSMS";
   private static final String ACTION_SEND_SMS = "sendSMS";
   public static final String OPT_LICENSE = "license";
   private static final String SEND_SMS_ACTION = "SENT_SMS_ACTION";
   private static final String DELIVERED_SMS_ACTION = "DELIVERED_SMS_ACTION";
   private static final String SMS_RECEIVED = "android.provider.Telephony.SMS_RECEIVED";
   public static final String SMS_EXTRA_NAME = "pdus";
   public static final String SMS_URI_ALL = "content://sms/";
   public static final String SMS_URI_INBOX = "content://sms/inbox";
   public static final String SMS_URI_SEND = "content://sms/sent";
   public static final String SMS_URI_DRAFT = "content://sms/draft";
   public static final String SMS_URI_OUTBOX = "content://sms/outbox";
   public static final String SMS_URI_FAILED = "content://sms/failed";
   public static final String SMS_URI_QUEUED = "content://sms/queued";
   public static final String BOX = "box";
   public static final String ADDRESS = "address";
   public static final String BODY = "body";
   public static final String READ = "read";
   public static final String SEEN = "seen";
   public static final String SUBJECT = "subject";
   public static final String SERVICE_CENTER = "service_center";
   public static final String DATE = "date";
   public static final String DATE_SENT = "date_sent";
   public static final String STATUS = "status";
   public static final String REPLY_PATH_PRESENT = "reply_path_present";
   public static final String TYPE = "type";
   public static final String PROTOCOL = "protocol";
   public static final int MESSAGE_TYPE_INBOX = 1;
   public static final int MESSAGE_TYPE_SENT = 2;
   public static final int MESSAGE_IS_NOT_READ = 0;
   public static final int MESSAGE_IS_READ = 1;
   public static final int MESSAGE_IS_NOT_SEEN = 0;
   public static final int MESSAGE_IS_SEEN = 1;
   private static final String SMS_GENERAL_ERROR = "SMS_GENERAL_ERROR";
   private static final String NO_SMS_SERVICE_AVAILABLE = "NO_SMS_SERVICE_AVAILABLE";
   private static final String SMS_FEATURE_NOT_SUPPORTED = "SMS_FEATURE_NOT_SUPPORTED";
   private static final String SENDING_SMS_ID = "SENDING_SMS";
   private ContentObserver mObserver = null;
   private BroadcastReceiver mReceiver = null;
   private boolean mIntercept = false;
   
   private String lastFrom = "";
   private String lastContent = "";
   
  

  public SMSPlugin() {}
   
 
   public void onDestroy() 
   
   { 
	   
	   stopWatch(null); 
	   
   }
   

   public boolean execute(String action, JSONArray inputs, CallbackContext callbackContext)
     throws JSONException
   {
	       PluginResult result = null;
   

      if ("startWatch".equals(action)) {
       result = startWatch(callbackContext);
     }
     else if ("stopWatch".equals(action)) {
       result = stopWatch(callbackContext);
     }
    else if ("enableIntercept".equals(action)) {
       boolean on_off = inputs.optBoolean(0);
       result = enableIntercept(on_off, callbackContext);
    }
    else if ("deleteSMS".equals(action)) {
      JSONObject msg = inputs.optJSONObject(0);
       result = deleteSMS(msg, callbackContext);
     }
   else if ("restoreSMS".equals(action)) {
       JSONArray smsList = inputs.optJSONArray(0);
       result = restoreSMS(smsList, callbackContext);
     }
     else if ("listSMS".equals(action)) {
       JSONObject filters = inputs.optJSONObject(0);
     result = listSMS(filters, callbackContext);
     }
     
     //******************************************************
     else if ("sendSMS".equals(action)) {
       String Phone = inputs.optString(0);
       String mess = inputs.optString(1);
       String method=inputs.optString(2);
       result = sendSMS(Phone, mess,method, callbackContext);
     }
     
     //********************************************************
     
     else {
       Log.d("SMSPlugin", String.format("Invalid action passed: %s", new Object[] { action }));
       result = new PluginResult(PluginResult.Status.INVALID_ACTION);
    }
  
    if (result != null) { callbackContext.sendPluginResult(result);
     }
     return true;
   }

   
   
   
   //**********************   IN construction ****************************************************
   private PluginResult sendSMS(String Phone, String messages,String methods,CallbackContext callbackContext) {
       String phoneNumber = Phone;
	   String message = messages;
	   String method = methods;
	   SmsSender smsSender=new SmsSender(this.cordova.getActivity());
	   if(method.equalsIgnoreCase("INTENT")){
	       smsSender.invokeSMSIntent(phoneNumber,message);
	       callbackContext.sendPluginResult(new PluginResult( PluginResult.Status.NO_RESULT));
	   } else{
	       smsSender.sendSMS(phoneNumber,message);
	   }

	   callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
	   
	   
	// TODO Auto-generated method stub
	return null;
}

   //********************* end **********************************************************************
   
   
   
//****************************************************************************************************
   
  private PluginResult startWatch(CallbackContext callbackContext) {
     Log.d("SMSPlugin", "startWatch");
     
     if (this.mObserver == null) {
       createContentObserver();
     }
    
     if (this.mReceiver == null) {
       createIncomingSMSReceiver();
     }
     
     if (callbackContext != null) callbackContext.success();
     return null;
   }

  
  //************************************************************************************************
  
 private PluginResult stopWatch(CallbackContext callbackContext) {
     Log.d("SMSPlugin", "stopWatch");
     
     Context ctx = this.cordova.getActivity();
     
     if (this.mReceiver != null) {
       ctx.unregisterReceiver(this.mReceiver);
      this.mReceiver = null;
       Log.d("SMSPlugin", "broadcast receiver unregistered");
     }
     if (this.mObserver != null) {
     ctx.getContentResolver().unregisterContentObserver(this.mObserver);
      this.mObserver = null;
      Log.d("SMSPlugin", "sms inbox observer unregistered");
   }
     if (callbackContext != null) callbackContext.success();
     return null;
   }
  
 
 //**************************************************************************************************
 
   private PluginResult enableIntercept(boolean on_off, CallbackContext callbackContext) {
    Log.d("SMSPlugin", "enableIntercept");
     
    this.mIntercept = on_off;
    
    if (callbackContext != null) callbackContext.success();
     return null;
   }
   
   
   //**************************************************************************************************
   private PluginResult listSMS(JSONObject filter, CallbackContext callbackContext) {
     Log.e("SMSPlugin", "listSMS");

   
     
     String uri_filter = filter.optString("box");
     int fread =filter.optInt("read");
     int fid   =filter.optInt("_id");
     String faddress = filter.optString("address");
     String fcontent = filter.optString("body");
     long fdate1 = filter.optLong("date");
     int indexFrom = filter.has("indexFrom") ? filter.optInt("indexFrom") : 0;
     int maxCount = filter.has("maxCount") ? filter.optInt("maxCount") :100;
     
    
 
    JSONArray jsons = new JSONArray();
    Context ctx = this.cordova.getActivity();
    Uri uri = Uri.parse("content://sms/" + uri_filter);
    Cursor cur =ctx.getContentResolver().query(uri, null,"", null,null);
   

    int i = 0;
    while (cur.moveToNext())
      if (i >= indexFrom) {
              i++;
   	       if (i >= indexFrom + maxCount) break;

        
              boolean matchFilter = false;
      
         if (fid > -1) {
          int _id = cur.getInt(cur.getColumnIndex("_id"));
          matchFilter = fid == _id;
                       }
         
        else if (fread > -1) {
           int read = cur.getInt(cur.getColumnIndex("read"));
           matchFilter = fread == read;
          
           }
         
       else if (faddress.length() > 0) {
         String address = cur.getString(cur.getColumnIndex("address")).trim();
     	     matchFilter =  address.contains(faddress);
           
           }
      
       else if (fdate1>0) {
    	   System.out.println(fdate1);
           long dateInMillis = cur.getLong(cur.getColumnIndex("date"));
           
           matchFilter = fdate1 <= dateInMillis;           
	      } 
         
       else if (fcontent.length() > 0) {
          String body = cur.getString(cur.getColumnIndex("body")).trim();
           
           matchFilter = body.equals(fcontent);
        }
         
       else {
             matchFilter = true;
            }
       
       if (matchFilter) {
      
         JSONObject json = getJsonFromCursor(cur);
 
     if (json == null) {
           callbackContext.error("failed to get json from cursor");
            cur.close();
             return null;
                       }

        
         jsons.put(json);
  
              
       
     }
      }
    cur.close();
     
    callbackContext.success(jsons);
   
     return null;
   }
   
   
   
   
   private JSONObject getJsonFromCursor(Cursor cur) {
     JSONObject json = new JSONObject();
   
    int nCol = cur.getColumnCount();
    String[] keys = cur.getColumnNames();
    try
     {
      for (int j = 0; j < nCol; j++) {
       switch (cur.getType(j)) {
         /*case 0: 
                    json.put(keys[j], null);
                    break;
         case 1: 
                    json.put(keys[j], cur.getInt(j));
                    break;
           
         case 2: 
                    json.put(keys[j], cur.getLong(j));
                    break;
         case 3: 
                    json.put(keys[j], cur.getFloat(j));
                    break;
         case 4: 
                    json.put(keys[j], cur.getString(j));
                    break;
          
         case 5: 
                    json.put(keys[j], cur.getBlob(j));
           */         
         case Cursor.FIELD_TYPE_BLOB   : json.put(keys[j], cur.getBlob(j).toString()); break;
         case Cursor.FIELD_TYPE_FLOAT  : json.put(keys[j], cur.getDouble(j))         ; break;
         case Cursor.FIELD_TYPE_INTEGER: json.put(keys[j], cur.getLong(j))           ; break;
         case Cursor.FIELD_TYPE_NULL   : json.put(keys[j], cur)                     ; break;
         case Cursor.FIELD_TYPE_STRING : json.put(keys[j], cur.getString(j))         ; break;
         
         
       }
      }
   }
    catch (Exception e) {
      e.printStackTrace();
     return null;
   }
   
     return json;
   }
   
   
   //**************************************************************************************************************
   
   
   private void triggerEvent(final String event, JSONObject json) {
     final String str = json.toString();
     Log.d("SMSPlugin", "Event: " + event + ", " + str);
   
     this.cordova.getActivity().runOnUiThread(new Runnable()
    {
       public void run() {
        String js = String.format("javascript:cordova.fireDocumentEvent(\"%s\", {\"data\":%s});", new Object[] { event, str });
        SMSPlugin.this.webView.loadUrl(js);
      }
     });
  }
 
   
   //********************************************************************************************************************
   
   private void onSMSArrive(JSONObject json) {
     String from = json.optString("address");
     String content = json.optString("body");
    
 
     if ((from.equals(this.lastFrom)) && (content.equals(this.lastContent))) { return;
 }
   this.lastFrom = from;
   this.lastContent = content;
     
     triggerEvent("onSMSArrive", json);
   }
   

   
   
   //*****************************************************************************************************************
   
   protected void createIncomingSMSReceiver() {
     Context ctx = this.cordova.getActivity();
   
     this.mReceiver = new BroadcastReceiver()
    {
       public void onReceive(Context context, Intent intent) {
         String action = intent.getAction();
         Log.d("SMSPlugin", "onRecieve: " + action);
         
         if ("android.provider.Telephony.SMS_RECEIVED".equals(action))
         {
           if (SMSPlugin.this.mIntercept) { abortBroadcast();
           }
           Bundle bundle = intent.getExtras();
           if (bundle != null)
           {
             Object[] pdus = (Object[])bundle.get("pdus");
             if (pdus.length != 0)
             {
               for (int i = 0; i < pdus.length; i++) {
                 SmsMessage sms = SmsMessage.createFromPdu((byte[])pdus[i]);
                 
                 JSONObject json = SMSPlugin.this.getJsonFromSmsMessage(sms);
                 SMSPlugin.this.onSMSArrive(json);
               }
               
             }
          }
        }
      }
    };
     String[] filterstr = { "android.provider.Telephony.SMS_RECEIVED" };
     for (int i = 0; i < filterstr.length; i++) {
      IntentFilter filter = new IntentFilter(filterstr[i]);
      filter.setPriority(100);
       ctx.registerReceiver(this.mReceiver, filter);
       Log.d("SMSPlugin", "broadcast receiver registered for: " + filterstr[i]);
    }
  }

   
   //***************************************************************************************************
   
   
  protected void createContentObserver() 
  
  {
    Context ctx = this.cordova.getActivity();
     
    this.mObserver = new ContentObserver(new Handler())
      {
    	
    	
      public void onChange(boolean selfChange)
        {
              onChange(selfChange, null);
        }
       
      public void onChange(boolean selfChange, Uri uri)
        {
         Log.d("SMSPlugin", "onChange, selfChange: " + selfChange + ", uri: " + uri);
         
         int id = -1;
         
         if (uri != null) {
           String str = uri.toString();
           if (str.startsWith("content://sms/")) {
             String box_or_id = str.substring("content://sms/".length());
             try {
               id = Integer.parseInt(str);
               Log.d("SMSPlugin", "sms id: " + id);
             }
           catch (NumberFormatException localNumberFormatException) {}
          }
        }
        
 
         if (id == -1) {
          uri = Uri.parse("content://sms/inbox");
        }
        
         ContentResolver resolver = SMSPlugin.this.cordova.getActivity().getContentResolver();
       Cursor cur = resolver.query(uri, null, null, null, "_id desc");
      if (cur != null) {
         int n = cur.getCount();
         Log.d("SMSPlugin", "n = " + n);
          if ((n > 0) && (cur.moveToFirst())) {
           JSONObject json = SMSPlugin.this.getJsonFromCursor(cur);
         if (json != null) {
           SMSPlugin.this.onSMSArrive(json);
        } else {
             Log.d("SMSPlugin", "fetch record return null");
        }
        }
        cur.close();
      }
      
      }
   };
   ctx.getContentResolver().registerContentObserver(Uri.parse("content://sms/inbox"), true, this.mObserver);
     Log.d("SMSPlugin", "sms inbox observer registered");
 }
 
  
  
  
//*********************************************************************************************************************
  
  
   private PluginResult deleteSMS(JSONObject filter, CallbackContext callbackContext) {
    Log.d("SMSPlugin", "deleteSMS");
   
     String uri_filter = filter.has("box") ? filter.optString("box") : "inbox";
     int fread = filter.has("read") ? filter.optInt("read") : -1;
     int fid = filter.has("_id") ? filter.optInt("_id") : -1;
     String faddress = filter.optString("address");
     String fcontent = filter.optString("body");
     
     Context ctx = this.cordova.getActivity();
     int n = 0;
     try {
       Uri uri = Uri.parse("content://sms/" + uri_filter);
       Cursor cur = ctx.getContentResolver().query(uri, null, "", null, null);
       while (cur.moveToNext()) {
         int id = cur.getInt(cur.getColumnIndex("_id"));
         boolean matchId = (fid > -1) && (fid == id);
         
         int read = cur.getInt(cur.getColumnIndex("read"));
         boolean matchRead = (fread > -1) && (fread == read);
         
         String address = cur.getString(cur.getColumnIndex("address")).trim();
        boolean matchAddr = (faddress.length() > 0) && (address.equals(faddress));
         
         String body = cur.getString(cur.getColumnIndex("body")).trim();
         boolean matchContent = (fcontent.length() > 0) && (body.equals(fcontent));
       
         if ((matchId) || (matchRead) || (matchAddr) || (matchContent)) {
         ctx.getContentResolver().delete(uri, "_id=" + id, null);
          n++;
        }
     }
       callbackContext.success(n);
     }
     catch (Exception e) {
      callbackContext.error(e.toString());
   }
    
     return null;
   }
 
   
   //********************************************************************************************************
   
   private JSONObject getJsonFromSmsMessage(SmsMessage sms) {
     JSONObject json = new JSONObject();
    try
     {
      json.put("address", sms.getOriginatingAddress());
      json.put("body", sms.getMessageBody());
      json.put("date_sent", sms.getTimestampMillis());
      json.put("date", System.currentTimeMillis());
      json.put("read", 0);
      json.put("seen", 0);
      json.put("status", sms.getStatus());
      json.put("type", 1);
      json.put("service_center", sms.getServiceCenterAddress());
     }
     catch (Exception e) {
       e.printStackTrace();
     }
    
     return json;
   }
   
   private ContentValues getContentValuesFromJson(JSONObject json) {
     ContentValues values = new ContentValues();
     values.put("address", json.optString("address"));
     values.put("body", json.optString("body"));
     values.put("date_sent", Long.valueOf(json.optLong("date_sent")));
     values.put("read", Integer.valueOf(json.optInt("read")));
     values.put("seen", Integer.valueOf(json.optInt("seen")));
     values.put("type", Integer.valueOf(json.optInt("type")));
     values.put("service_center", json.optString("service_center"));
    return values;
   }
  
   private PluginResult restoreSMS(JSONArray array, CallbackContext callbackContext)
   {
     ContentResolver resolver = this.cordova.getActivity().getContentResolver();
     Uri uri = Uri.parse("content://sms/inbox");
     
     int n = array.length();int m = 0;
   
     for (int i = 0; i < n; i++) {
    JSONObject json = array.optJSONObject(i);
       if (json != null) {
       String str = json.toString();
       Log.d("SMSPlugin", str);
      
        Uri newuri = resolver.insert(uri, getContentValuesFromJson(json));
       Log.d("SMSPlugin", "inserted: " + newuri.toString());
        
       m++;
       }
     }
    
    if (callbackContext != null) callbackContext.success(m);
     return null;
   }
 }

 
 
 //*****************************************************
 
 class SmsSender {
	    private Activity activity;

	    public SmsSender(Activity activity){
	        this.activity=activity;
	    }

	    public void invokeSMSIntent(String phoneNumber, String message) {
	        Intent sendIntent = new Intent(Intent.ACTION_VIEW);
	        sendIntent.putExtra("sms_body", message);
	        sendIntent.setType("vnd.android-dir/mms-sms");
	        activity.startActivity(sendIntent);
	    }

	    public void sendSMS(String phoneNumber, String message) {
	        SmsManager manager = SmsManager.getDefault();
	        PendingIntent sentIntent = PendingIntent.getActivity(activity, 0, new Intent(), 0);
	        PendingIntent deliveryIntent=PendingIntent.getActivity(activity,0,new Intent(),0);
	        manager.sendTextMessage(phoneNumber, null, message, sentIntent, null);
	    }
	}
 
