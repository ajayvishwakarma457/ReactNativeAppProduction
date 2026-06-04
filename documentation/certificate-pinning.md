# Certificate Pinning Implementation Guide

This guide details the process for implementing **Certificate Pinning** in iOS and Android native configurations for our React Native application.

---

## 1. What is Certificate Pinning?

By default, when your app makes a secure HTTPS connection, it trusts any certificate signed by a valid Root Certificate Authority (CA) preloaded in the device’s OS trust store. 

**Certificate Pinning** restricts the certificates that your app will accept. By hardcoding (pinning) the cryptographic public key hash of your specific server's certificate directly into the app, you eliminate the risk of:
* Compromised Certificate Authorities signing rogue certificates.
* **Man-in-the-Middle (MITM)** intercept attacks on public/unsecured network connections.

---

## 2. Choosing the Best Approach: Native Declarative Pinning

We use platform-native declarative configurations to implement pinning rather than third-party JavaScript libraries (like `react-native-ssl-pinning` or OkHttp JS wrappers).

### Why Native Pinning is Superior:
1. **OS-Level Enforcement**: The OS network stack enforces the pinning rules automatically.
2. **Zero JS Overhead**: No bridging delays or Javascript thread blocking.
3. **App-Wide Protection**: Native configurations apply to **all** network requests, including standard `fetch`/`Axios` calls, native image downloads, third-party SDKs, and native components (like `WebView`).
4. **Secure**: Prevents attackers from using reverse-engineering toolkits (like Frida) to intercept and easily rewrite JS-level variables.

---

## 3. How to Extract Certificate Pins

You must extract the SHA-256 base64-encoded hashes of the target server's Subject Public Key Info (SPKI).

Run the following OpenSSL command locally using your production API domain:
```bash
openssl s_client -connect rnp-app.com:443 -servername rnp-app.com -showcerts | \
openssl x509 -pubkey -noout | \
openssl pkey -pubin -outform der | \
openssl dgst -sha256 -binary | \
openssl enc -base64
```
This command outputs the base64-encoded string representing the public key hash.

> [!WARNING]
> **Always configure a Backup Pin.** You must extract a pin from a secondary or backup Certificate Authority (or a backup CSR key) to prevent the application from failing to connect if the primary certificate needs to be rotated quickly (e.g., due to key compromise or expiration).

---

## 4. Android Implementation

On Android, certificate pinning is managed via the **Network Security Config** file:

1. **Config File**: [network_security_config.xml](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/android/app/src/main/res/xml/network_security_config.xml)
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <network-security-config>
       <domain-config>
           <domain includeSubdomains="true">rnp-app.com</domain>
           <pin-set expiration="2027-12-31">
               <!-- Primary Pin -->
               <pin digest="SHA-256">rnp-app-primary-pin-placeholder-base64=</pin>
               <!-- Backup Pin -->
               <pin digest="SHA-256">rnp-app-backup-pin-placeholder-base64=</pin>
           </pin-set>
       </domain-config>
   </network-security-config>
   ```

2. **Integration**: Linked inside the `<application>` tag of the [AndroidManifest.xml](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/android/app/src/main/AndroidManifest.xml):
   ```xml
   <application
     ...
     android:networkSecurityConfig="@xml/network_security_config">
   ```

---

## 5. iOS Implementation

On iOS 14+, App Transport Security (ATS) natively supports certificate pinning directly via the `Info.plist` configurations:

1. **Info.plist Configuration**: Inside [Info.plist](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/ios/App/Info.plist):
   ```xml
   <key>NSAppTransportSecurity</key>
   <dict>
       <key>NSAllowsArbitraryLoads</key>
       <false/>
       <key>NSAllowsLocalNetworking</key>
       <true/>
       <key>NSPinnedDomains</key>
       <dict>
           <key>rnp-app.com</key>
           <dict>
               <key>NSIncludesSubdomains</key>
               <true/>
               <key>NSIdentityPinnedPublicKeyHashes</key>
               <array>
                   <dict>
                       <key>Algorithm</key>
                       <string>Rsa2048</string>
                       <key>PublicKeyHash</key>
                       <string>rnp-app-primary-pin-placeholder-base64=</string>
                   </dict>
                   <dict>
                       <key>Algorithm</key>
                       <string>Rsa2048</string>
                       <key>PublicKeyHash</key>
                       <string>rnp-app-backup-pin-placeholder-base64=</string>
                   </dict>
               </array>
           </dict>
       </dict>
   </dict>
   ```

Supported algorithms include `Rsa2048`, `Rsa3072`, `Rsa4096`, `EcDsaSecp256r1`, and `EcDsaSecp384r1`.
