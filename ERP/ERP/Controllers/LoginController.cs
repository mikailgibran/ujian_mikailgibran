using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using ERP.Models;

namespace ERP.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        private DtClassSetmulDataContext db_setmul;
        public ActionResult Index()
        {
            return View();
        }

        public bool checkValidUser(string username = "", string password = "")
        {
            bool iReturn = false;

            db_setmul = new DtClassSetmulDataContext();

            try
            {

                var profile = db_setmul.tbl_m_users.Where(f => f.username.Equals(username) && f.password.Equals(password)).FirstOrDefault();

                if (profile != null)
                {
                    iReturn = true;
                }
                else
                {
                    iReturn = false;
                }

            }
            catch (Exception)
            {
                iReturn = false;
            }


            return iReturn;
        }

        [HttpPost]
        public ActionResult getUser(string username = "", string password = "")
        {
            db_setmul = new DtClassSetmulDataContext();
            bool bl_status = false;
            bl_status = checkValidUser(username, password);

            if (bl_status)
            {
                var list_user = db_setmul.tbl_m_users.Where(f => f.username == username).ToList();

                if (list_user.Count > 0)
                {
                    var ivwEmployee = db_setmul.tbl_m_users.Where(f => f.username.Equals(username)).FirstOrDefault();

                    // -----------------------------------------------------------------------------------------
                    foreach (var v in list_user)
                    {
                        Session["username"] = v.username;
                        Session["nama_user"] = v.nama_user;

                    }
                    return RedirectToAction("Index", "Dashboard");

                }
                TempData["notice"] = "Username anda tidak di temukan di database, Pastikan anda sudah terdaftar.. !!";
            }
           
            return RedirectToAction("Index", "Login");
        }

        public ActionResult logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("index", "login");
        }
    }
}