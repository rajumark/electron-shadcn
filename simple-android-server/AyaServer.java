import java.io.*;
import java.net.*;
import java.util.*;
import org.json.JSONObject;
import org.json.JSONArray;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.res.AssetManager;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import android.util.Log;

public class AyaServer {
    private static final String TAG = "AyaServer";
    private static final String ICON_CACHE_DIR = "/data/local/tmp/aya/icons";
    
    public static void main(String[] args) {
        try {
            // Create icon cache directory
            new File(ICON_CACHE_DIR).mkdirs();
            
            // Start simple socket server
            ServerSocket serverSocket = new ServerSocket(9999);
            Log.i(TAG, "AyaServer started on port 9999");
            
            while (true) {
                try {
                    Socket client = serverSocket.accept();
                    handleClient(client);
                } catch (Exception e) {
                    Log.e(TAG, "Error handling client", e);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Server error", e);
        }
    }
    
    private static void handleClient(Socket client) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
        PrintWriter out = new PrintWriter(client.getOutputStream(), true);
        
        String line;
        while ((line = in.readLine()) != null) {
            try {
                JSONObject request = new JSONObject(line);
                String method = request.getString("method");
                JSONObject response = new JSONObject();
                
                switch (method) {
                    case "getPackageInfos":
                        response = handleGetPackageInfos(request);
                        break;
                    case "getVersion":
                        response.put("version", "1.0.0");
                        break;
                    default:
                        response.put("error", "Unknown method: " + method);
                }
                
                out.println(response.toString());
            } catch (Exception e) {
                JSONObject error = new JSONObject();
                error.put("error", e.getMessage());
                out.println(error.toString());
            }
        }
        
        client.close();
    }
    
    private static JSONObject handleGetPackageInfos(JSONObject request) throws Exception {
        JSONArray packageNames = request.getJSONArray("packageNames");
        PackageManager pm = null; // Would need context - simplified version
        JSONArray result = new JSONArray();
        
        // Simplified version - just return basic info without real icon extraction
        for (int i = 0; i < packageNames.length(); i++) {
            String packageName = packageNames.getString(i);
            JSONObject info = new JSONObject();
            info.put("packageName", packageName);
            info.put("label", packageName);
            info.put("icon", ""); // Empty for now
            result.put(info);
        }
        
        JSONObject response = new JSONObject();
        response.put("packageInfos", result);
        return response;
    }
}
