<%@ Page Title="" Language="C#" MasterPageFile="~/Areas/aspx/Views/Shared/Web.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
<<div class="demo-section k-content">
        <h4>Show e-mails from:</h4>
        <%= Html.Kendo().DatePicker()
              .Name("datepicker")
              .Value("10/10/2011")
              .HtmlAttributes(new { style = "width: 100%" })
        %>
    <h4 style="margin-top: 2em;">Add to archive mail from:</h4>
        <%= Html.Kendo().DatePicker()
              .Name("monthpicker")
              .Start(CalendarView.Year)
              .Depth(CalendarView.Year)
              .Format("MMMM yyyy")
              .Value("November 2011")
              .HtmlAttributes(new { style = "width: 100%" })
        %>
</div>
</asp:Content>