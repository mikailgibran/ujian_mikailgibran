using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ERP.Models;
using Kendo.DynamicLinq;

namespace ERP.Controllers
{
    public class DashboardController : Controller
    {
        private DtClassSetmulDataContext db_setmul = new DtClassSetmulDataContext();
        private string iStrSessUSERNAME = string.Empty;

        // GET: Dashboard
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
        public JsonResult getCount()
        {
            try
            {
                this.pv_CustLoadSession();
                var data = db_setmul.cusp_count_dashboard();

                return Json(data);
            }
            catch (Exception e)
            {
                return Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AJaxChartBar(int tipe)
        {
            try
            {
                this.pv_CustLoadSession();

                var data = db_setmul.cusp_chartbar_dashboard(tipe).OrderBy(s=>s.jenis).ToList();
                

                return Json(new { data = data, total = data.Count() });
            }
            catch (Exception e)
            {
                return Json(e.ToString());
            }
        }

    }
}