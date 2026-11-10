# Security Specification & "Dirty Dozen" Hardened Audit

## 1. Data Invariants
1. **Visitor Document Isolation**: A visitor can only write (create or update) their designated `/visitors/{visitorId}` document where the document ID matches `incoming().visitorId`.
2. **Visitor Read Shielding**: Public/anonymous visitors CANNOT perform `list` operations over the `/visitors` collection. They cannot scrape or enumerate other visitors' responses, names, Snapchat IDs, or personal messages.
3. **Admin Privilege Enforcement**: Only authenticated users possessing an authorization record in `/admins/{uid}` can perform `list` queries or delete operations over the `/visitors` collection.
4. **Field Immutability**: `visitorId` and `createdAt` are strictly immutable once a visitor record is established.
5. **Temporal Integrity**: `createdAt` on creation and `updatedAt` on every update must strictly match `request.time`.
6. **Volumetric Boundaries**: String inputs are rigidly length-capped (`visitorName` <= 100, `personalMessage` <= 2000, `snapchatId` <= 100) to defeat Denial of Wallet and storage pollution exploits.
7. **No Self-Elevated Roles**: Non-admin clients cannot write or mutate any documents inside `/admins/{adminId}`.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1: Path & ID Mismatch (Identity Spoofing)**
   - Attempt: Write to `/visitors/target_user_99` with payload `{ visitorId: "attacker_01", ... }`.
   - Expected: PERMISSION_DENIED.

2. **Payload 2: List Scraping Attempt (Unauthorized Enumeration)**
   - Attempt: Unauthenticated query `db.collection('visitors').get()`.
   - Expected: PERMISSION_DENIED.

3. **Payload 3: Oversized Message Injection (Denial of Wallet)**
   - Attempt: Submit `personalMessage` of 50,000 characters.
   - Expected: PERMISSION_DENIED (`personalMessage.size() <= 2000`).

4. **Payload 4: Client-Spoofed `createdAt` Manipulation**
   - Attempt: Create record with `createdAt: timestamp.fromDate(new Date('2020-01-01'))`.
   - Expected: PERMISSION_DENIED (`incoming().createdAt == request.time`).

5. **Payload 5: Overwriting Immutable `createdAt`**
   - Attempt: Update record changing `createdAt` to a different timestamp.
   - Expected: PERMISSION_DENIED (`incoming().createdAt == existing().createdAt`).

6. **Payload 6: Shadow Field Injection**
   - Attempt: Create record with unexpected fields `{ isVip: true, role: "admin", bypass: 1 }`.
   - Expected: PERMISSION_DENIED (strict key allowlist).

7. **Payload 7: Unauthorized Self-Promotion to `/admins`**
   - Attempt: Direct `setDoc(doc(db, 'admins', myUid), { role: 'admin' })`.
   - Expected: PERMISSION_DENIED (no public write access to `/admins`).

8. **Payload 8: Document ID Poisoning**
   - Attempt: Create record with junk ID containing non-alphanumeric special characters or > 128 characters.
   - Expected: PERMISSION_DENIED (`isValidId(visitorId)`).

9. **Payload 9: Deleting Other Visitors' Records**
   - Attempt: Unauthenticated or non-admin call `deleteDoc(doc(db, 'visitors', 'victim_123'))`.
   - Expected: PERMISSION_DENIED.

10. **Payload 10: Invalid Status Transition**
    - Attempt: Set `completionStatus: "hacked_status"`.
    - Expected: PERMISSION_DENIED (`completionStatus in ['in_progress', 'completed']`).

11. **Payload 11: Final Answer Tampering with Non-Allowed Value**
    - Attempt: Set `finalAnswer: "MAYBE_SOMEDAY_EXTRA_STRING_12345"`.
    - Expected: PERMISSION_DENIED (`finalAnswer in ['YES', 'NO']` or size <= 50).

12. **Payload 12: Blank Name Submission**
    - Attempt: Create visitor with empty string `visitorName: ""`.
    - Expected: PERMISSION_DENIED (`visitorName.size() >= 1`).
