import pandas as pd

# Set display options to view all columns clearly
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

# ==============================================================================
# 1. COMPLAINTS DATAFRAME (df_complaints)
# ==============================================================================
df_complaints = pd.DataFrame([
    {
        "complaint_id": "CMP-1001",
        "reporter_name": "sautanyha",
        "user_email": "sautanyhassree@gmail.com",
        "issue_type": "Missed Waste Collection",
        "priority": "Medium",
        "zone": "East Zone",
        "location": "A-Z Indiranagar",
        "status": "Submitted",
        "assigned_to": "Unassigned"
    },
    {
        "complaint_id": "CMP-2001",
        "reporter_name": "Dhivya Dharshini S",
        "user_email": "dhivya.dharshini.s@smartwaste.gov.in",
        "issue_type": "Overflowing Bin",
        "priority": "Critical",
        "zone": "East Zone",
        "location": "100 Feet Road, Near Metro Station, Indiranagar",
        "status": "In Review",
        "assigned_to": "Suresh Kumar (Field Staff)"
    },
    {
        "complaint_id": "CMP-2002",
        "reporter_name": "Divyadharshini K",
        "user_email": "divyadharshini.k@smartwaste.gov.in",
        "issue_type": "Missed Waste Collection",
        "priority": "High",
        "zone": "South Zone",
        "location": "5th Block Commercial Market Road, Koramangala",
        "status": "Assigned",
        "assigned_to": "Suresh Kumar (Field Staff)"
    },
    {
        "complaint_id": "CMP-2003",
        "reporter_name": "Kavisurya B",
        "user_email": "kavisurya.b@smartwaste.gov.in",
        "issue_type": "Damaged / Broken Bin",
        "priority": "Medium",
        "zone": "East Zone",
        "location": "ITPL Main Gate, Whitefield Tech Zone",
        "status": "In Review",
        "assigned_to": "Unassigned"
    },
    {
        "complaint_id": "CMP-2004",
        "reporter_name": "Rithu Pavisha S",
        "user_email": "rithu.pavisha.s@smartwaste.gov.in",
        "issue_type": "Foul Odor / Hazardous Waste",
        "priority": "Critical",
        "zone": "South Zone",
        "location": "27th Main Road, Sector 2, HSR Layout",
        "status": "Assigned",
        "assigned_to": "Suresh Kumar (Field Staff)"
    },
    {
        "complaint_id": "CMP-2005",
        "reporter_name": "Sautanyhassre B T",
        "user_email": "sautanyhassre.b.t@smartwaste.gov.in",
        "issue_type": "Overflowing Bin",
        "priority": "High",
        "zone": "Central Zone",
        "location": "Church Street Junction, MG Road Metro Station",
        "status": "Submitted",
        "assigned_to": "Unassigned"
    },
    {
        "complaint_id": "CMP-2006",
        "reporter_name": "Shreya B",
        "user_email": "shreya.b@smartwaste.gov.in",
        "issue_type": "Illegal Dumping",
        "priority": "High",
        "zone": "North Zone",
        "location": "Near Hebbal Flyover Service Road",
        "status": "Submitted",
        "assigned_to": "Unassigned"
    },
    {
        "complaint_id": "CMP-2007",
        "reporter_name": "Varsha C",
        "user_email": "varsha.c@smartwaste.gov.in",
        "issue_type": "Vehicle Spillage",
        "priority": "Medium",
        "zone": "West Zone",
        "location": "Rajajinagar 1st Block Main Road",
        "status": "Resolved",
        "assigned_to": "Suresh Kumar (Field Staff)"
    },
    {
        "complaint_id": "CMP-2008",
        "reporter_name": "PS",
        "user_email": "ps@smartwaste.gov.in",
        "issue_type": "Overflowing Bin",
        "priority": "Critical",
        "zone": "Central Zone",
        "location": "Brigade Road Commercial Hub Cross",
        "status": "Assigned",
        "assigned_to": "Suresh Kumar (Field Staff)"
    }
])

# ==============================================================================
# 2. USERS DATAFRAME (df_users)
# ==============================================================================
df_users = pd.DataFrame([
    {"name": "Rajesh Sharma (Director)", "email": "admin@smartwaste.gov.in", "role": "admin", "zone": "Central Zone"},
    {"name": "SAUTANYHASSREE", "email": "sautanyhassree@gmail.com", "role": "admin", "zone": "East Zone"},
    {"name": "Suresh Kumar (Field Staff)", "email": "staff@smartwaste.gov.in", "role": "staff", "zone": "South Zone"},
    {"name": "DIVYA", "email": "divyadharshinik@gmail.com", "role": "staff", "zone": "East Zone"},
    {"name": "geetha", "email": "geethabalaji2004sre@gmail.com", "role": "staff", "zone": "East Zone"},
    {"name": "Priya Verma (Citizen / Resident)", "email": "viewer@smartwaste.gov.in", "role": "viewer", "zone": "East Zone"},
    {"name": "RITHU PAVISHA S", "email": "rithupavisha.ct23@bitsathy.ac.in", "role": "viewer", "zone": "East Zone"},
    {"name": "DIVYADHARSHINI K", "email": "divyadharshinik.ct23@bitsathy.ac.in", "role": "viewer", "zone": "East Zone"},
    {"name": "divyadharshinik", "email": "divyakarunakaran234@gmail.com", "role": "viewer", "zone": "East Zone"},
    {"name": "Pratheep", "email": "pratheeps2024@gmail.com", "role": "viewer", "zone": "East Zone"}
])

# ==============================================================================
# 3. SMART BINS DATAFRAME (df_bins)
# ==============================================================================
df_bins = pd.DataFrame([
    {"bin_id": "BIN-101", "name": "Indiranagar 100ft Rd Bin A", "zone": "East Zone", "fill_level": 94, "status": "Critical", "category": "Plastic"},
    {"bin_id": "BIN-102", "name": "Koramangala 5th Block Hub", "zone": "South Zone", "fill_level": 0, "status": "Empty", "category": "Organic"},
    {"bin_id": "BIN-103", "name": "Whitefield ITPL Main Gate", "zone": "East Zone", "fill_level": 88, "status": "Critical", "category": "General"},
    {"bin_id": "BIN-104", "name": "MG Road Trinity Circle", "zone": "Central Zone", "fill_level": 78, "status": "High", "category": "Recyclable"},
    {"bin_id": "BIN-105", "name": "HSR Layout Sector 1 Market", "zone": "South Zone", "fill_level": 82, "status": "High", "category": "Organic"},
    {"bin_id": "BIN-106", "name": "Jayanagar 4th Block Complex", "zone": "South Zone", "fill_level": 65, "status": "Moderate", "category": "General"},
    {"bin_id": "BIN-107", "name": "Malleshwaram 8th Cross", "zone": "West Zone", "fill_level": 45, "status": "Moderate", "category": "Plastic"},
    {"bin_id": "BIN-108", "name": "Electronic City Phase 1 Gate", "zone": "South Zone", "fill_level": 58, "status": "Moderate", "category": "Electronic"}
])

# ==============================================================================
# 4. VEHICLES DATAFRAME (df_vehicles)
# ==============================================================================
df_vehicles = pd.DataFrame([
    {"vehicle_id": "VEH-101", "registration_no": "KA-01-WM-1001", "type": "Compactor Truck", "capacity_tons": 8.5, "status": "Available"},
    {"vehicle_id": "VEH-102", "registration_no": "KA-01-WM-2002", "type": "Mini Tipper", "capacity_tons": 3.5, "status": "Assigned"},
    {"vehicle_id": "VEH-103", "registration_no": "KA-01-WM-3003", "type": "Hook Loader", "capacity_tons": 10.0, "status": "Collecting"},
    {"vehicle_id": "VEH-104", "registration_no": "KA-01-WM-4004", "type": "Electric Cart", "capacity_tons": 1.2, "status": "Available"},
    {"vehicle_id": "VEH-105", "registration_no": "KA-01-WM-5005", "type": "Compactor Truck", "capacity_tons": 8.5, "status": "Maintenance"}
])

if __name__ == "__main__":
    print("==================================================================")
    print("               SMART WASTE MANAGEMENT DATABASE - DATAFRAMES       ")
    print("==================================================================")
    print("\n--- 1. COMPLAINTS (df_complaints) ---")
    print(df_complaints[["complaint_id", "reporter_name", "issue_type", "priority", "status"]])
    
    print("\n--- 2. USERS (df_users) ---")
    print(df_users[["name", "email", "role", "zone"]])
    
    print("\n--- 3. SMART BINS (df_bins) ---")
    print(df_bins[["bin_id", "name", "fill_level", "status", "category"]])
    
    print("\n--- 4. FLEET VEHICLES (df_vehicles) ---")
    print(df_vehicles[["vehicle_id", "registration_no", "type", "status"]])
    print("==================================================================")
