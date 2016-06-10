(function() {
    var TableResizing = kendo.ui.editor.TableResizing;
    var ColumnResizing = kendo.ui.editor.ColumnResizing;
    var editor;
    var table;
    var tableResizing;
    var DOT = ".";
    var HANDLE_SELECTOR = ".k-resize-handle";
    var NS = "kendoEditor";
    var MOUSE_ENTER = "mouseenter";
    var MOUSE_LEAVE = "mouseleave";
    var MOUSE_MOVE = "mousemove";
    var TABLE_HTML =
        '<table id="table" class="k-table">' +
            '<tr id="row1" class="row">' +
                '<td id="col11" class="col">col 11</td>' +
                '<td id="col12" class="col">col 12</td>' +
                '<td id="col13" class="col">col 13</td>' +
            '</tr>' +
            '<tr id="row2" class="row">' +
                '<td id="col21" class="col">+col 21</td>' +
                '<td id="col22" class="col">+col 22</td>' +
                '<td id="col23" class="col">+col 23</td>' +
            '</tr>' +
            '<tr id="row3" class="row">' +
                '<td id="col31" class="col">+col 31</td>' +
                '<td id="col32" class="col">+col 32</td>' +
                '<td id="col33" class="col">+col 33</td>' +
            '</tr>' +
        '</table>';
    var CONTENT_HTML = '<div id="wrapper">' + TABLE_HTML + '</div>';

    function triggerEvent(element, eventOptions) {
        var options = $.extend({
            type: "mousedown",
            clientX: 0,
            clientY: 0
        }, eventOptions || {});

        $(element).trigger(options);
    }

    editor_module("editor table resizing", {
        beforeEach: function() {
            editor = $("#editor-fixture").data("kendoEditor");
            editor.tableResizing = null;
            $(editor.body).append($(CONTENT_HTML)[0]);
            $(TABLE_HTML).attr("id", "table2").appendTo(editor.body)[0];
            table = $(TABLE_HTML).appendTo(QUnit.fixture)[0];
        },

        afterEach: function() {
            if (editor) {
                $(editor.body).find("*").remove();
            }
            removeMocksIn(editor.tableResizing);
            kendo.destroy(QUnit.fixture);
        }
    });

    test("hovering a table should initialize table resizing", function() {
        var table = $(editor.body).find("#table")[0];

        triggerEvent(table, { type: MOUSE_ENTER });

        ok(editor.tableResizing instanceof kendo.ui.editor.TableResizing);
    });

    test("hovering a table should initialize table resizing with table element", function() {
        var table = $(editor.body).find("#table")[0];

        triggerEvent(table, { type: MOUSE_ENTER });

        equal(editor.tableResizing.element, table);
    });

    test("hovering a table should initialize table resizing with empty options", function() {
        var table = $(editor.body).find("#table")[0];

        triggerEvent(table, { type: MOUSE_ENTER });

        deepEqual(editor.tableResizing.options, {});
    });

    test("hovering a different table should destroy current table resizing", function() {
        var table = $(editor.body).find("#table")[0];
        var newTable = $(editor.body).find("#table2")[0];
        var tableResizing = editor.tableResizing = new TableResizing(table, {});
        trackMethodCall(tableResizing, "destroy");

        triggerEvent(newTable, { type: MOUSE_ENTER });

        equal(tableResizing.destroy.callCount, 1);
    });

    test("hovering the same table twice should not destroy current table resizing", function() {
        var table = $(editor.body).find("#table")[0];
        var tableResizing = editor.tableResizing = new TableResizing(table, {});
        trackMethodCall(tableResizing, "destroy");

        triggerEvent(table, { type: MOUSE_ENTER });

        equal(tableResizing.destroy.callCount, 0);
    });

    test("moving out of a table should destroy table resizing", function() {
        var table = $(editor.body).find("#table")[0];
        editor.tableResizing = new TableResizing(table, {});
        editor.tableResizing.resizingInProgress = function() { return false; };
        var mock = editor.tableResizing;
        trackMethodCall(mock, "destroy");

        triggerEvent(table, { type: MOUSE_LEAVE });

        ok(mock.destroy.callCount === 1);
        ok(editor.tableResizing === null);
    });

    test("moving out of a table should not destroy table resizing if resizing is in progress", function() {
        var table = $(editor.body).find("#table")[0];
        editor.tableResizing = new TableResizing(table, {});
        editor.tableResizing.resizingInProgress = function() { return true; };
        trackMethodCall(editor.tableResizing, "destroy");

        triggerEvent(table, { type: MOUSE_LEAVE });

        equal(editor.tableResizing.destroy.callCount, 0);
    });

    module("editor table resizing", {
        setup: function() {
            table = $(TABLE_HTML).appendTo(QUnit.fixture)[0];
        },

        teardown: function() {
            if (tableResizing) {
                tableResizing.destroy();
            }
            kendo.destroy(QUnit.fixture);
        }
    });

    test("table resizing should be initialized with custom options", function() {
        var options = { property: "value" };

        tableResizing = new TableResizing(table, options);

        ok(tableResizing.options, options);
    });

    test("column resizing should be initialized from table resizing", function() {
        tableResizing = new TableResizing(table, {});

        ok(tableResizing.columnResizing instanceof kendo.ui.editor.ColumnResizing);
    });

    test("column resizing should not be initialized with custom options", function() {
        tableResizing = new TableResizing(table, {});

        notDeepEqual(tableResizing.columnResizing.options, {});
    });

    test("column resizing should be initialized with table element", function() {
        tableResizing = new TableResizing(table, {});

        equal(tableResizing.columnResizing.element, table);
    });

    module("editor table resizing", {
        setup: function() {
            table = $(TABLE_HTML).appendTo(QUnit.fixture)[0];
        },

        teardown: function() {
            if (tableResizing) {
                tableResizing.destroy();
            }
            kendo.destroy(QUnit.fixture);
        }
    });

    test("destroy should call column resizing destory", function() {
        tableResizing = new TableResizing(table, {});
        var columnResizing = tableResizing.columnResizing;
        trackMethodCall(columnResizing, "destroy");

        tableResizing.destroy();

        equal(columnResizing.destroy.callCount, 1);
    });

    test("destroy should detach event handlers", function() {
        tableResizing.destroy();

        ok(jQueryEvents(tableResizing.element) === undefined);
    });

    module("editor table resizing", {
        setup: function() {
            table = $(TABLE_HTML).appendTo(QUnit.fixture)[0];
            tableResizing = new TableResizing(table, {});
        },

        teardown: function() {
            if (tableResizing) {
                tableResizing.destroy();
            }
            kendo.destroy(QUnit.fixture);
        }
    });

    test("resizingInProgress should be true while resizing columns", function() {
        var columnResizing = tableResizing.columnResizing = new ColumnResizing(tableResizing.element, {});

        columnResizing.resizable = { resizing: true, destroy: $.noop };

        ok(tableResizing.resizingInProgress() === true);
    });

    test("resizingInProgress should be false when column resizing is stopped", function() {
        var columnResizing = tableResizing.columnResizing = new ColumnResizing(tableResizing.element, {});

        columnResizing.resizable = { resizing: false, destroy: $.noop };

        ok(tableResizing.resizingInProgress() === false);
    });
})();
