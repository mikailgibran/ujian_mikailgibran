using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ERP.Models;
using Kendo.DynamicLinq;

namespace ERP.Controllers
{
    public class TransaksiController : Controller
    {
        private DtClassSetmulDataContext db_setmul = new DtClassSetmulDataContext();
        private string iStrSessUSERNAME = string.Empty;
        // GET: TPembelian
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
        #region pembelian
        [HttpPost]
        public JsonResult ReadPembelian(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                var data = db_setmul.tbl_t_pembelians.OrderByDescending(s => s.tanggal_transaksi);
                return Json(data.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return Json(new { status = false, error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult CreatePembelian(tbl_t_pembelian stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            pv_CustLoadSession();

            if (stbl.tanggal_transaksi == null)
            {
                i_str_remarks = "Tanggal transaksi tidak boleh kosong.";
            }
            else if (stbl.kode_barang == null || stbl.kode_barang == "")
            {
                i_str_remarks = "Kode barang tidak boleh kosong.";
            }
            else if (stbl.nama_barang == null || stbl.nama_barang == "")
            {
                i_str_remarks = "Nama barang tidak boleh kosong.";
            }
            else if (stbl.pengukuran == null || stbl.pengukuran == "")
            {
                i_str_remarks = "Pengukuran tidak boleh kosong.";
            }
            else if (stbl.jumlah_pembelian == null)
            {
                i_str_remarks = "Jumlah pembelian tidak boleh kosong.";
            }
            else if (stbl.harga == null)
            {
                i_str_remarks = "Harga tidak boleh kosong.";
            }
            else if (stbl.total == null)
            {
                i_str_remarks = "Total tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var itbl = new tbl_t_pembelian();
                    itbl.pid = Guid.NewGuid().ToString();
                    itbl.tanggal_transaksi = stbl.tanggal_transaksi;
                    itbl.kode_barang = stbl.kode_barang;
                    itbl.nama_barang = stbl.nama_barang;
                    itbl.pengukuran = stbl.pengukuran;
                    itbl.jumlah_pembelian = stbl.jumlah_pembelian;
                    itbl.harga = stbl.harga;
                    itbl.total = stbl.total;
                    itbl.created_by = iStrSessUSERNAME;
                    itbl.created_date = DateTime.Now;

                    db_setmul.tbl_t_pembelians.InsertOnSubmit(itbl);
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
        public JsonResult UpdatePembelian(tbl_t_pembelian stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            if (stbl.tanggal_transaksi == null)
            {
                i_str_remarks = "Tanggal transaksi tidak boleh kosong.";
            }
            else if (stbl.kode_barang == null || stbl.kode_barang == "")
            {
                i_str_remarks = "Kode barang tidak boleh kosong.";
            }
            else if (stbl.nama_barang == null || stbl.nama_barang == "")
            {
                i_str_remarks = "Nama barang tidak boleh kosong.";
            }
            else if (stbl.pengukuran == null || stbl.pengukuran == "")
            {
                i_str_remarks = "Pengukuran tidak boleh kosong.";
            }
            else if (stbl.jumlah_pembelian == null)
            {
                i_str_remarks = "Jumlah pembelian tidak boleh kosong.";
            }
            else if (stbl.harga == null)
            {
                i_str_remarks = "Harga tidak boleh kosong.";
            }
            else if (stbl.total == null)
            {
                i_str_remarks = "Total tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var itbl = db_setmul.tbl_t_pembelians.Where(s => s.pid == stbl.pid ).FirstOrDefault();
                    itbl.tanggal_transaksi = stbl.tanggal_transaksi;
                    itbl.kode_barang = stbl.kode_barang;
                    itbl.nama_barang = stbl.nama_barang;
                    itbl.pengukuran = stbl.pengukuran;
                    itbl.jumlah_pembelian = stbl.jumlah_pembelian;
                    itbl.harga = stbl.harga;
                    itbl.total = stbl.total;
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
        public JsonResult DeletePembelian(tbl_t_pembelian stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            try
            {
                var itbl = db_setmul.tbl_t_pembelians.Where(s => s.pid == stbl.pid).FirstOrDefault();

                db_setmul.tbl_t_pembelians.DeleteOnSubmit(itbl);
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
        #endregion pembelian

        #region penjualan

        [HttpPost]
        public JsonResult GenerateNoTransaksi()
        {
            try
            {


                using (DtClassSetmulDataContext db = new DtClassSetmulDataContext())
                {
                    this.pv_CustLoadSession();

                    var data = db_setmul.cufn_GenerateNoTrans();
                    return Json(data);
                }
            }
            catch (Exception e)
            {
                return Json(new { status = false, error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ReadTotalPenjualan(string no_transaksi)
        {
            try
            {


                using (DtClassSetmulDataContext db = new DtClassSetmulDataContext())
                {
                    this.pv_CustLoadSession();

                    var harga_total_sum = db_setmul.tbl_item_penjualans
                                   .Where(x => x.no_transaksi == no_transaksi)
                                   .Sum(x => (decimal?)x.harga_total);
                    return Json(harga_total_sum);
                }
            }
            catch (Exception e)
            {
                return Json(new { status = false, error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult ReadPenjualan(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                var data = db_setmul.tbl_t_penjualans.OrderByDescending(s => s.tanggal_transaksi);
                return Json(data.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return Json(new { status = false, error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult CreatePenjualan(tbl_t_penjualan stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            pv_CustLoadSession();


            if (stbl.tanggal_transaksi == null)
            {
                i_str_remarks = "Tanggal transaksi tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var count_penjualan = db_setmul.tbl_item_penjualans.Where(s => s.no_transaksi == stbl.no_transaksi).Count();
                    if (count_penjualan > 0)
                    {
                         var harga_total_sum = db_setmul.tbl_item_penjualans
                                   .Where(x => x.no_transaksi == stbl.no_transaksi)
                                   .Sum(x => (decimal?)x.harga_total);

                        var itbl = new tbl_t_penjualan();
                        itbl.no_transaksi = stbl.no_transaksi;
                        itbl.tanggal_transaksi = stbl.tanggal_transaksi;
                        itbl.total = harga_total_sum;
                        itbl.created_by = iStrSessUSERNAME;
                        itbl.created_date = DateTime.Now;

                        db_setmul.tbl_t_penjualans.InsertOnSubmit(itbl);

                    }
                    
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
        public JsonResult UpdatePenjualan(tbl_t_penjualan stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            if (stbl.tanggal_transaksi == null)
            {
                i_str_remarks = "Tanggal transaksi tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var itbl = db_setmul.tbl_t_penjualans.Where(s => s.no_transaksi == stbl.no_transaksi).FirstOrDefault();
                    itbl.tanggal_transaksi = stbl.tanggal_transaksi;
                    itbl.total = stbl.total;
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
        public JsonResult DeletePenjualan(tbl_t_penjualan stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            try
            {
                //delete detailnya 
                //var itbl_detail = db_setmul.tbl_item_penjualans.Where(t => stbl.no_transaksi.Contains(t.no_transaksi)).ToList();
                //db_setmul.tbl_item_penjualans.DeleteAllOnSubmit(itbl_detail);

                var itbl_detail = from c in db_setmul.tbl_item_penjualans
                              where c.no_transaksi == stbl.no_transaksi
                              select c;

                foreach (var item in itbl_detail)
                {
                    db_setmul.tbl_item_penjualans.DeleteOnSubmit(item);
                }

                //delete headernya
                var itbl = db_setmul.tbl_t_penjualans.Where(s => s.no_transaksi == stbl.no_transaksi).FirstOrDefault();
                db_setmul.tbl_t_penjualans.DeleteOnSubmit(itbl);
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
        #endregion penjualan

        #region add item penjualan
        [HttpPost]
        public JsonResult ReadItemPenjualan(string no_transaksi,int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                var data = db_setmul.tbl_item_penjualans.Where(s=>s.no_transaksi == no_transaksi)
                    .OrderByDescending(s => s.nama_barang);
                return Json(data.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return Json(new { status = false, error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult CreateItemPenjualan(tbl_item_penjualan stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            pv_CustLoadSession();

            if (stbl.nama_barang == null || stbl.nama_barang == "")
            {
                i_str_remarks = "Nama barang tidak boleh kosong.";
            }
            else if (stbl.jumlah == null)
            {
                i_str_remarks = "Jumlah tidak boleh kosong.";
            }
            else if (stbl.harga_satuan == null)
            {
                i_str_remarks = "Harga satuan tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var itbl = new tbl_item_penjualan();
                    itbl.pid = Guid.NewGuid().ToString();
                    itbl.no_transaksi = stbl.no_transaksi;
                    itbl.kode_barang = stbl.kode_barang;
                    itbl.nama_barang = stbl.nama_barang;
                    itbl.jumlah = stbl.jumlah;
                    itbl.harga_satuan = stbl.harga_satuan;
                    itbl.harga_total = stbl.harga_total;
                    itbl.created_by = iStrSessUSERNAME;
                    itbl.created_date = DateTime.Now;

                    db_setmul.tbl_item_penjualans.InsertOnSubmit(itbl);
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
        public JsonResult DeleteItemPenjualan(tbl_item_penjualan stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            try
            {
                var itbl = db_setmul.tbl_item_penjualans.Where(s => s.pid == stbl.pid).FirstOrDefault();

                db_setmul.tbl_item_penjualans.DeleteOnSubmit(itbl);
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
        #endregion add item penjualan
    }

}