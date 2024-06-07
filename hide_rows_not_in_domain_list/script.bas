Sub FilterByDomain()
    On Error GoTo ErrorHandler
    
    Dim ws As Worksheet
    Dim domainSheet As Worksheet
    Dim rng As Range
    Dim domainRange As Range
    Dim cell As Range
    Dim lastRow As Long
    Dim domain As String
    Dim domains As Object
    Dim domainCell As Range
    
    ' Create a dictionary to hold the domains
    Set domains = CreateObject("Scripting.Dictionary")
    
    ' Set the domain sheet and range
    Set domainSheet = ThisWorkbook.Sheets("Domains")
    If domainSheet Is Nothing Then
        MsgBox "Domains sheet not found.", vbExclamation
        Exit Sub
    End If
    
    lastRow = domainSheet.Cells(domainSheet.Rows.Count, "A").End(xlUp).Row
    Set domainRange = domainSheet.Range("A1:A" & lastRow)
    
    ' Populate the dictionary with domains, handling single quotes and adding "@" if necessary
    For Each domainCell In domainRange
        If domainCell.Value <> "" Then
            domain = domainCell.Value
            ' Remove single quotes if present
            domain = Replace(domain, "'", "")
            ' Add "@" if not present
            If Left(domain, 1) <> "@" Then
                domain = "@" & domain
            End If
            domains(domain) = True
        End If
    Next domainCell
    
    ' Set your worksheet and the range containing emails
    Set ws = ThisWorkbook.Sheets("Sheet1") ' Change to your report sheet name
    If ws Is Nothing Then
        MsgBox "Sheet1 not found.", vbExclamation
        Exit Sub
    End If
    
    lastRow = ws.Cells(ws.Rows.Count, "C").End(xlUp).Row ' Assuming emails are in column C
    If lastRow < 2 Then
        MsgBox "No email addresses found.", vbExclamation
        Exit Sub
    End If
    
    Set rng = ws.Range("C2:C" & lastRow) ' Adjust if your data starts from a different row. Starting from C2 so the header on the first row does not get hidden
    
    ' Loop through each cell and hide the rows that don't match the domains
    For Each cell In rng
        If InStr(cell.Value, "@") > 0 Then
            domain = Mid(cell.Value, InStr(cell.Value, "@"))
            If domains.exists(domain) Then
                cell.EntireRow.Hidden = False
            Else
                cell.EntireRow.Hidden = True
            End If
        Else
            cell.EntireRow.Hidden = True
        End If
    Next cell

    Exit Sub

ErrorHandler:
    MsgBox "An error occurred: " & Err.Description, vbCritical
End Sub
