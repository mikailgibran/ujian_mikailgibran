using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (Session["USERNAME"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            //this.pv_CustLoadSession();
            //ViewBag.leftMenu = loadMenu();
            //ViewBag.GPID = iStrSessGPID;
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}