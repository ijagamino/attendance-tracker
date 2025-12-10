$DatabaseName = "attendance_tracking_system"

Write-Host "Creating database: $DatabaseName"

mysql -u root -e "CREATE DATABASE IF NOT EXISTS $DatabaseName;"

Write-Host "Done!"