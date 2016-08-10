﻿using Telerik.Windows.Documents.Spreadsheet.Model;
using Document = Telerik.Windows.Documents.Spreadsheet.Model.Workbook;

namespace Telerik.Web.Spreadsheet.Tests
{
    static class TestHelper
    {
        public static Workbook CreateWorkbook()
        {
            var workbook = new Workbook();
            var sheet = workbook.AddSheet(); 

            var row = new Row { Index = 1 };
            row.AddCell(new Cell { Index = 1, Value = "Foo", Format = "@" });
            row.AddCell(new Cell { Index = 2, Value = 42 });
            row.AddCell(new Cell { Index = 3, Value = 2.71 });
            row.AddCell(new Cell { Index = 4, Formula = "A1 + B1" });
            row.AddCell(new Cell { Index = 5, Value = "Фу" });
            row.AddCell(new Cell { Index = 6, Value = "Фу", Link = "FooLink" });

            sheet.AddRow(row);

            return workbook;
        }

        public static Document CreateDocument()
        {
            var document = new Document();
            var worksheet = document.Worksheets.Add();

            worksheet.Cells[1, 1].SetValue("Foo");
            worksheet.Cells[1, 1].SetFormat(new CellValueFormat("@"));

            worksheet.Cells[1, 2].SetValue(42);
            worksheet.Cells[1, 3].SetValue(2.71);
            worksheet.Cells[1, 4].SetValue("=A1 + B1");
            worksheet.Cells[1, 5].SetValue("Фу");

            var link = HyperlinkInfo.CreateHyperlink("FooLinkValue");
            worksheet.Hyperlinks.Add(new CellRange(1, 6, 1, 6), link);

            document.ActiveWorksheet = worksheet;

            return document;
        }        
    }
}
