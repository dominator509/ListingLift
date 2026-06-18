-- Phase 5 baseline checksums (before any rollback testing)
-- Generated at start of Phase 5

SELECT 'Job' AS t, COUNT(*)::text AS c, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') AS chk FROM "Job"
UNION ALL SELECT 'Image', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "Image"
UNION ALL SELECT 'User', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "User"
UNION ALL SELECT 'Session', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "Session"
UNION ALL SELECT 'UploadBatch', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "UploadBatch"
UNION ALL SELECT 'Client', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "Client"
UNION ALL SELECT 'Organization', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "Organization"
UNION ALL SELECT 'UploadToken', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "UploadToken"
UNION ALL SELECT 'IdempotencyKey', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "IdempotencyKey"
UNION ALL SELECT 'StripeCheckoutSession', COUNT(*)::text, COALESCE(MD5(STRING_AGG(COALESCE(id::text,''),',' ORDER BY id)), 'empty') FROM "StripeCheckoutSession";
