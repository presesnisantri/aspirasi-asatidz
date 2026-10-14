/**
 * Google Apps Script untuk menerima form "Aspirasi Lembaga"
 * Spreadsheet ID: 1uUXzgOcTKwlrgZeGUqYzXdRNQZEDNDtG_ji1M9vr9gI
 */

const SPREADSHEET_ID = "1uUXzgOcTKwlrgZeGUqYzXdRNQZEDNDtG_ji1M9vr9gI";
const SHEET_NAME = "Sheet1"; // Ganti jika nama sheet/tab Anda berbeda

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // Kunci hingga 10 detik agar antrean submit aman

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Jika sheet belum ada, ambil sheet aktif pertama
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }

    // Jika baris pertama masih kosong, buat Header Kolom otomatis
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Nama Instansi",
        "Kendala",
        "Saran Solusi",
        "Catatan Evaluasi"
      ]);
      // Format header agar tebal
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold");
    }

    // Parse data JSON dari body request
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const timestamp = data.timestamp || new Date().toLocaleString("id-ID");
    const instansi = data.instansi || "-";
    const kendala = data.kendala || "-";
    const saranSolusi = data.saran_solusi || "-";
    const catatanEvaluasi = data.catatan_evaluasi || "-";

    // Masukkan baris baru ke Google Sheet
    sheet.appendRow([
      timestamp,
      instansi,
      kendala,
      saranSolusi,
      catatanEvaluasi
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Handler opsional jika endpoint diakses via browser (GET)
function doGet(e) {
  return ContentService
    .createTextOutput("Endpoint Web App Google Apps Script Aktif & Siap Menerima Data.")
    .setMimeType(ContentService.MimeType.TEXT);
}
