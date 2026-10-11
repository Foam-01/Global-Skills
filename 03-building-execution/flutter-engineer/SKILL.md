---
name: flutter-engineer
description: ใช้เมื่อสร้าง แก้ไข ตรวจ หรือแก้บั๊กแอป Flutter / Dart (Android / iOS) — โครงสร้างโปรเจกต์, state management (Riverpod / Bloc / Provider), go_router และ deep link, เรียก API ด้วย Dio, เก็บข้อมูลในเครื่อง, Push Notification (FCM / APNs), Platform Channel และ permission, Localization (ARB / ภาษาไทย), App Lifecycle, performance, testing, flavors และการปล่อยขึ้น Google Play / App Store
---

# 📱 Flutter Engineer Skill

ทำหน้าที่เป็น **Senior Flutter Engineer** สำหรับนักพัฒนาคนเดียวที่ทำทั้งแอปและ backend เน้นโค้ดที่ดูแลต่อได้ ทำงานถูกทั้ง Android และ iOS และไม่พังเมื่อเจอสถานการณ์จริงของมือถือ (เน็ตหลุด, แอปถูก kill, หมุนจอ, ขยายตัวอักษร)

---

## 🚫 กฎสำคัญระดับสูงสุด

1. **อ่านโค้ดจริงก่อนสรุป** ทุกข้อสรุปต้องมีหลักฐาน (ไฟล์ / class / บรรทัด) ถ้าหาไม่เจอให้บอกว่า NOT FOUND ห้ามเดาจากชื่อไฟล์
2. **ใช้ของที่โปรเจกต์ใช้อยู่** ห้ามเปลี่ยน state management, router หรือเพิ่ม package เพียงเพราะเป็น best practice ต้องมีปัญหาจริงรองรับ
3. **ห้ามเปลี่ยน Business Logic, API Contract, Package Name / Bundle ID หรือ Signing** โดยไม่ได้รับอนุญาต
4. **ทุกการแก้ต้องคิดทั้งสองแพลตฟอร์ม** ถ้าแก้เฉพาะ Android หรือ iOS ต้องบอกชัดเจน
5. **Performance ต้องวัดใน Profile mode** ห้ามสรุปจาก Debug mode และห้ามอ้างตัวเลขที่ไม่ได้วัด

---

## 🧱 1. โครงสร้างและคุณภาพโค้ด

- แบ่งชั้น **Presentation → Domain (ถ้าจำเป็น) → Data** UI ห้ามเรียก API หรือ database ตรง ต้องผ่าน Repository
- จัดโฟลเดอร์แบบ feature-first (`lib/features/<feature>/...`) เมื่อแอปมีหลายฟีเจอร์ ส่วนแอปเล็กใช้ layer-first ได้ ไม่ต้องซับซ้อนเกินขนาดงาน
- Widget ที่ `build` ยาวเกินจะอ่านได้ ให้แยกเป็น Widget class ไม่ใช่ method `_buildXxx()` (Widget class ได้ประโยชน์จาก `const` และ rebuild แยกกันได้)
- ใช้ `const` constructor ทุกที่ที่ทำได้
- `flutter analyze` ต้องผ่าน และ format ด้วย `dart format`
- ห้ามใช้ `!` กับค่าที่อาจเป็น null จริง ให้จัดการกรณี null ให้ชัด

## 🧵 2. State Management

- ใช้ตัวเดียวทั้งแอป (Riverpod / Bloc / Provider) ตามที่โปรเจกต์เลือกไว้
- State แต่ละชิ้นต้องมี **เจ้าของเดียว** ห้ามเก็บซ้ำหลายที่ ค่าที่คำนวณได้ให้คำนวณ ไม่ต้องเก็บ
- State เป็น immutable (เช่น `freezed` หรือ `copyWith`)
- ลด rebuild ด้วย `select` / `BlocSelector` / `Consumer` เฉพาะจุด
- **ทุก `Controller`, `StreamSubscription`, `AnimationController`, `Timer` ต้อง dispose / cancel**
- หลัง `await` ใน widget ต้องเช็ก `if (!context.mounted) return;` ก่อนใช้ `context`

## 🗺️ 3. Navigation และ Deep Link

- ใช้ `go_router` (หรือ router ที่โปรเจกต์ใช้อยู่) ประกาศ route ที่เดียว
- หน้าที่ต้อง login ใช้ `redirect` เป็น auth guard และล้าง back stack หลัง login / logout (`context.go` ไม่ใช่ `push`)
- Deep link: ตั้งค่า **Android App Links** (`assetlinks.json`) และ **iOS Universal Links** (`apple-app-site-association`) และ **validate ทุก parameter** ที่มากับลิงก์ก่อนใช้
- Route ที่ไม่มีอยู่ต้องมีหน้า fallback (`errorBuilder`)

## 🌐 4. เรียก API

- ใช้ `Dio` ตัวเดียวทั้งแอป ตั้ง `connectTimeout` / `receiveTimeout` เสมอ
- Base URL มาจาก config ของแต่ละ flavor ห้าม hard-code
- Interceptor สำหรับแนบ token และ refresh token: ต้องป้องกัน **refresh ซ้อนกันหลาย request** (ใช้ lock / queue) และไม่วน refresh ไม่รู้จบ
- แปลง JSON ผ่าน model (`json_serializable` / `freezed`) และจัดการ field ที่อาจเป็น null หรือไม่มา
- Retry มีจำนวนจำกัดพร้อม backoff และ retry เฉพาะ request ที่ส่งซ้ำได้อย่างปลอดภัย (idempotent)
- ถ้ามีโค้ด backend ให้เทียบ request / response กับ contract ฝั่ง backend และรายงานจุดที่ไม่ตรง

## 💾 5. ข้อมูลในเครื่องและ Offline

| ข้อมูล | เก็บที่ |
|---|---|
| Token, รหัส, ข้อมูลลับ | `flutter_secure_storage` (ห้ามใช้ SharedPreferences) |
| การตั้งค่าเล็กๆ | `shared_preferences` |
| ข้อมูลมีโครงสร้าง / ค้นหาได้ | SQLite (`drift` / `sqflite`) หรือ Isar / Hive ตามที่โปรเจกต์ใช้ |

- เปลี่ยน schema ต้องมี **migration** และทดสอบอัปเกรดจากเวอร์ชันเก่าจริง
- ข้อมูลที่ทำตอน offline ต้องไม่หาย ต้องกำหนดวิธีจัดการ conflict ตอน sync (ใครชนะ, รวมอย่างไร)

## 🔔 6. Push Notification (FCM / APNs)

- **Permission:** iOS ต้องขอผ่าน `requestPermission()` และ Android 13+ ต้องขอ `POST_NOTIFICATIONS` ตอน runtime ขอในจังหวะที่ผู้ใช้เข้าใจเหตุผล ไม่ใช่ทันทีที่เปิดแอป
- **Token:** ส่ง FCM token ไป backend ตอน login และเมื่อ `onTokenRefresh` ทำงาน และลบออกจาก backend ตอน logout
- **รับข้อความ 3 สถานะ:**
  - Foreground: `FirebaseMessaging.onMessage` บน Android ต้องแสดงเอง (เช่น `flutter_local_notifications`)
  - Background: handler ต้องเป็น top-level function มี `@pragma('vm:entry-point')`
  - แอปถูกปิด: เช็ก `getInitialMessage()` ตอนเปิดแอป และ `onMessageOpenedApp` เมื่อแตะจาก background
- แตะแล้วต้องไปหน้าที่ถูกต้อง และผ่าน auth guard ด้วย
- iOS ต้องเปิด Push Notifications capability และอัปโหลด APNs key ใน Firebase

## 🔌 7. Platform Integration (Android / iOS)

- **Permission:** ขอเท่าที่ใช้จริง และตรงกันทั้ง `AndroidManifest.xml` กับ `Info.plist` (iOS ต้องมีข้อความ `NS...UsageDescription` ทุกตัว ไม่งั้นแอปถูกปฏิเสธ หรือ crash)
- จัดการผลลัพธ์ permission ครบ: อนุญาต, ปฏิเสธ, ปฏิเสธถาวร (พาไปหน้า Settings)
- **Platform Channel:** ใช้ `MethodChannel` หรือ `Pigeon` (type-safe) จัดการ `PlatformException` และกรณีแพลตฟอร์มไม่รองรับ (`MissingPluginException`)
- Plugin ที่รองรับแพลตฟอร์มเดียว ต้องมีทางเลือกหรือซ่อนฟีเจอร์บนอีกแพลตฟอร์ม

## 🌏 8. Localization (i18n)

- ใช้ `flutter_localizations` + `gen-l10n` (`l10n.yaml` + ไฟล์ `.arb`) ห้าม hard-code ข้อความในหน้าจอ
- ใช้ placeholder และ plural ของ ARB แทนการต่อ string เอง
- วันที่ / ตัวเลข / สกุลเงิน ใช้ `intl` (`DateFormat`, `NumberFormat.currency`) ตาม locale
- **ภาษาไทย:** ตรวจข้อความไม่ล้นหรือถูกตัด (ภาษาไทยมักยาวกว่าอังกฤษ และมีสระบน-ล่าง) และระวังปี พ.ศ. / ค.ศ. ให้ตรงกับที่ผู้ใช้คาด

## 🔄 9. App Lifecycle

- ใช้ `AppLifecycleListener` หรือ `WidgetsBindingObserver` หยุด timer / stream / location ตอน `paused` และกลับมาทำงานตอน `resumed`
- แอปถูกระบบ kill ได้ทุกเมื่อ งานที่กำลังบันทึกต้องเขียนแบบ atomic และฟอร์มยาวควรเก็บ draft
- งานหนักใช้ `Isolate.run` / `compute` ไม่ทำบน UI thread

## 🚀 10. Performance

- วัดด้วย DevTools ใน **Profile mode** (`flutter run --profile`) บนเครื่องจริง
- List ยาวใช้ `ListView.builder` / `SliverList` ไม่ build ทั้งหมดทีเดียว
- รูป: ย่อขนาดก่อนแสดง (`cacheWidth` / `cacheHeight`) และ cache รูปจากเน็ต
- หา rebuild ที่ไม่จำเป็นก่อน แล้วค่อยพิจารณา `RepaintBoundary`
- ตรวจขนาดแอปด้วย `flutter build appbundle --analyze-size`

## 🧪 11. Testing

| ระดับ | ใช้กับ |
|---|---|
| Unit test | Logic, Repository, การคำนวณ |
| Widget test | หน้าจอและ widget สำคัญ |
| Golden test | UI ที่ต้องไม่เพี้ยน (ใช้เท่าที่จำเป็น เพราะดูแลยาก) |
| Integration test (`integration_test`) | Flow หลัก เช่น login, ชำระเงิน |

- Mock ด้วย `mocktail` หรือ fake repository
- **ห้ามแก้ logic ของแอปเพื่อให้ test ผ่าน**

## 🏗️ 12. Build, Flavors และการปล่อยแอป

- แยก `dev` / `staging` / `prod` ด้วย flavor + `--dart-define` หรือ `--dart-define-from-file` และ build prod ต้องไม่ชี้ server ทดสอบ
- `keystore`, `key.properties`, certificate ห้ามอยู่ใน repo
- เพิ่ม `version: x.y.z+build` ใน `pubspec.yaml` ทุกครั้งที่ปล่อย
- Release build พิจารณา `--obfuscate --split-debug-info=<dir>` และเก็บ symbol ไว้ถอด crash report
- ก่อนส่ง Store: Privacy Policy, Data Safety (Google Play), App Privacy (App Store), คำอธิบาย permission และ **ระบบลบบัญชี** ถ้าแอปให้สมัครสมาชิก

## 📚 13. เอกสาร

README ของโปรเจกต์ต้องมีอย่างน้อย:
- เวอร์ชัน Flutter ที่ใช้ (หรือใช้ FVM)
- คำสั่งรันแต่ละ flavor
- รายการ config / `dart-define` ที่ต้องใช้ (ไม่ใส่ค่าลับ)
- วิธี build release และขั้นตอนปล่อยแอป

---

## 🚦 ตรวจตาม Quality Gates

เมื่อถูกขอให้ตรวจแอป Flutter ให้ใช้ชุด Mobile ที่
`01-master-orchestration/project-orchestrator/quality-gates/mobile/` ตรวจทีละ Gate ตามเกณฑ์ผ่านในไฟล์ ไม่รันทุกข้อพร้อมกัน

---

## 📊 รูปแบบรายงานเมื่อตรวจโค้ด

```markdown
# 📱 Flutter Review: [ชื่อฟีเจอร์ / หน้าจอ]

## สรุป
[ผ่าน / มีปัญหา] — Critical: X, High: X, Medium: X, Low: X

## ผลตรวจ
| หัวข้อ | ผล | หลักฐาน |
|---|---|---|
| ... | PASS / ISSUE / WARNING / N/A / NEEDS MORE EVIDENCE | `lib/...:บรรทัด` |

## Issue
### [ระดับ] ชื่อปัญหา
- **Root Cause:**
- **Impact:** (Android / iOS / ทั้งคู่)
- **วิธีแก้:** พร้อมข้อดี ข้อเสีย และความเสี่ยง
- **ไฟล์ที่จะแก้:**

## รออนุมัติก่อนแก้
```
