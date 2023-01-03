using System.Web;
using System.Web.Optimization;

namespace ERP
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                       "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            //Export scripts
            bundles.Add(new ScriptBundle("~/bundles/Export").Include(
            "~/Kendo/Blob.js",
            "~/Kendo/FileSaver.min.js",
            "~/Kendo/FileSaver.js"));

            //Export with kendo scripts
            bundles.Add(new ScriptBundle("~/bundles/ExportKendo").Include(
            "~/Kendo/jszip.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/kendo_js").Include(
                   "~/Kendo/js/kendo.all.min.js",
                   "~/Kendo/js/kendo.aspnetmvc.min.js",
                   "~/Scripts/jquery.prettyPhoto.js"));

            bundles.Add(new ScriptBundle("~/bundles/tpl_js").Include(
                      "~/Tpl/jquery.js",
                      "~/Tpl/bootstrap.js",
                      "~/Tpl/jquery.nanoscroller.min.js",
                      "~/Tpl/scripts.js"));

    }
    }
}
