using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ERP.Models;
using Kendo.DynamicLinq;

namespace ERP.Controllers
{
    public class LaporanController : Controller
    {
        private DtClassSetmulDataContext db_setmul = new DtClassSetmulDataContext();
        private string iStrSessUSERNAME = string.Empty;

        // GET: Laporan
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
        public JsonResult Read(string periode, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                var data = db_setmul.vw_reports.Where(s => s.periode == periode).OrderBy(s => s.periode);
                return Json(data.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return Json(new { status = false, error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}