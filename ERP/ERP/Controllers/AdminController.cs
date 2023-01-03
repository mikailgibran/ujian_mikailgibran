using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ERP.Models;
using Kendo.DynamicLinq;

namespace ERP.Controllers
{
    public class AdminController : Controller
    {
        private DtClassSetmulDataContext db_setmul = new DtClassSetmulDataContext();
        private string iStrSessUSERNAME = string.Empty;

        // GET: Admin
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
                var data = db_setmul.tbl_m_users.OrderBy(s => s.nama_user);
                return Json(data.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return Json(new { status = false, error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult Create(tbl_m_user stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            pv_CustLoadSession();

            if (stbl.username == null || stbl.username == "")
            {
                i_str_remarks = "Username tidak boleh kosong.";
            }
            else if (stbl.nama_user == null || stbl.nama_user == "")
            {
                i_str_remarks = "Nama User tidak boleh kosong.";
            }
            else if (stbl.password == null || stbl.password == "")
            {
                i_str_remarks = "Password tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var itbl = new tbl_m_user();
                    itbl.username = stbl.username;
                    itbl.nama_user = stbl.nama_user;
                    itbl.password = stbl.password;
                    itbl.created_by = iStrSessUSERNAME;
                    itbl.created_date = DateTime.Now;

                    db_setmul.tbl_m_users.InsertOnSubmit(itbl);
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
        public JsonResult Update(tbl_m_user stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            if (stbl.username == null || stbl.username == "")
            {
                i_str_remarks = "Username tidak boleh kosong.";
            }
            else if (stbl.nama_user == null || stbl.nama_user == "")
            {
                i_str_remarks = "Nama User tidak boleh kosong.";
            }
            else if (stbl.password == null || stbl.password == "")
            {
                i_str_remarks = "Password tidak boleh kosong.";
            }
            else
            {
                try
                {
                    var itbl = db_setmul.tbl_m_users.Where(s => s.username == stbl.username).FirstOrDefault();
                    itbl.nama_user = stbl.nama_user;
                    itbl.password = stbl.password;
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
        public JsonResult Delete(tbl_m_user stbl)
        {
            bool? i_bl_status = false;
            string i_str_remarks = "";
            string type = "DANGER";
            try
            {
                var itbl = db_setmul.tbl_m_users.Where(s => s.username == stbl.username).FirstOrDefault();

                db_setmul.tbl_m_users.DeleteOnSubmit(itbl);
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