using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ERP.Models;
using Kendo.DynamicLinq;

namespace ERP.Controllers
{
    public class MBarangController : Controller
    {
        private DtClassSetmulDataContext db_setmul = new DtClassSetmulDataContext();
        private string iStrSessUSERNAME = string.Empty;

        // GET: MBarang
        public ActionResult Index()
        {
            if (Session["username"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        private void pv_CustLoadSession()
        {
            iStrSessUSERNAME = (string)Session["USERNAME"];
        }

        [HttpPost]
        public JsonResult Read(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                var data = db_setmul.tbl_m_barangs.OrderBy(s => s.nama_barang);
                return Json(data.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return Json(new { status = false, error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult Create(tbl_m_barang stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            pv_CustLoadSession();

            if (stbl.kode_barang == null || stbl.kode_barang == "")
            {
                i_str_remarks = "Kode Barang tidak boleh kosong.";
            }
            else if (stbl.nama_barang == null || stbl.nama_barang == "")
            {
                i_str_remarks = "Nama Barang tidak boleh kosong.";
            }
            else if (stbl.pengukuran == null || stbl.pengukuran == "")
            {
                i_str_remarks = "Pengukuran tidak boleh kosong.";
            }
            else if (stbl.stok_barang == null || stbl.stok_barang == "")
            {
                i_str_remarks = "Stok Barang tidak boleh kosong.";
            }
            else if (stbl.harga_barang == null || stbl.harga_barang == "")
            {
                i_str_remarks = "Harga Barang tidak boleh kosong.";
            }
            else if (stbl.jumlah_berat == null || stbl.jumlah_berat == "")
            {
                i_str_remarks = "Jumlah Berat tidak boleh kosong.";
            }
            else if (stbl.tgl_msk_gudang == null || stbl.tgl_msk_gudang == "")
            {
                i_str_remarks = "Tanggal Masuk Gudang tidak boleh kosong.";
            }
            else if (stbl.tgl_exp == null || stbl.tgl_exp == "")
            {
                i_str_remarks = "Tanggal Expired tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var itbl = new tbl_m_barang();
                    itbl.kode_barang = stbl.kode_barang;
                    itbl.nama_barang = stbl.nama_barang;
                    itbl.pengukuran = stbl.pengukuran;
                    itbl.stok_barang = stbl.stok_barang;
                    itbl.harga_barang = stbl.harga_barang;
                    itbl.jumlah_berat = stbl.jumlah_berat;
                    itbl.tgl_msk_gudang = stbl.tgl_msk_gudang;
                    itbl.tgl_exp = stbl.tgl_exp;
                    itbl.created_by = iStrSessUSERNAME;
                    itbl.created_date = DateTime.Now;

                    db_setmul.tbl_m_barangs.InsertOnSubmit(itbl);
                    db_setmul.SubmitChanges();
                    i_str_remarks = "Data berhasil disimpan.";
                    i_bl_status = true;
                    type = "SUCCESS";
                }
                catch (Exception e)
                {
                    return Json(new { i_bl_status = false, type = type, i_str_remarks = "Data gagal disimpan, error " + e.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { status = i_bl_status, type = type, remarks = i_str_remarks });

        }

        [HttpPost]
        public JsonResult Update(tbl_m_barang stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            if (stbl.kode_barang == null || stbl.kode_barang == "")
            {
                i_str_remarks = "Kode Barang tidak boleh kosong.";
            }
            else if (stbl.nama_barang == null || stbl.nama_barang == "")
            {
                i_str_remarks = "Nama Barang tidak boleh kosong.";
            }
            else if (stbl.pengukuran == null || stbl.pengukuran == "")
            {
                i_str_remarks = "Pengukuran tidak boleh kosong.";
            }
            else if (stbl.stok_barang == null || stbl.stok_barang == "")
            {
                i_str_remarks = "Stok Barang tidak boleh kosong.";
            }
            else if (stbl.harga_barang == null || stbl.harga_barang == "")
            {
                i_str_remarks = "Harga Barang tidak boleh kosong.";
            }
            else if (stbl.jumlah_berat == null || stbl.jumlah_berat == "")
            {
                i_str_remarks = "Jumlah Berat tidak boleh kosong.";
            }
            else if (stbl.tgl_msk_gudang == null || stbl.tgl_msk_gudang == "")
            {
                i_str_remarks = "Tanggal Masuk Gudang tidak boleh kosong.";
            }
            else if (stbl.tgl_exp == null || stbl.tgl_exp == "")
            {
                i_str_remarks = "Tanggal Expired tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var itbl = db_setmul.tbl_m_barangs.Where(s => s.kode_barang == stbl.kode_barang).FirstOrDefault();
                    itbl.nama_barang = stbl.nama_barang;
                    itbl.pengukuran = stbl.pengukuran;
                    itbl.stok_barang = stbl.stok_barang;
                    itbl.harga_barang = stbl.harga_barang;
                    itbl.jumlah_berat = stbl.jumlah_berat;
                    itbl.tgl_msk_gudang = stbl.tgl_msk_gudang;
                    itbl.tgl_exp = stbl.tgl_exp;
                    itbl.modified_by = iStrSessUSERNAME;
                    itbl.modified_date = DateTime.Now;

                    db_setmul.SubmitChanges();
                    i_str_remarks = "Data berhasil disimpan.";
                    i_bl_status = true;
                    type = "SUCCESS";
                }
                catch (Exception e)
                {
                    return Json(new { i_bl_status = false, type = type, i_str_remarks = "Data gagal disimpan, error " + e.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { status = i_bl_status, type = type, remarks = i_str_remarks });

        }
        [HttpPost]
        public JsonResult Delete(tbl_m_barang stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            try
            {
                var itbl = db_setmul.tbl_m_barangs.Where(s => s.kode_barang == stbl.kode_barang).FirstOrDefault();

                db_setmul.tbl_m_barangs.DeleteOnSubmit(itbl);
                db_setmul.SubmitChanges();
                i_str_remarks = "Data berhasil dihapus.";
                i_bl_status = true;
                type = "SUCCESS";
            }
            catch (Exception e)
            {
                return Json(new { i_bl_status = false, type = type, i_str_remarks = "Data gagal disimpan, error " + e.ToString() }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { status = i_bl_status, type = type, remarks = i_str_remarks });

        }


    }
}