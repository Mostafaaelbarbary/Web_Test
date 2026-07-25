import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/shared.css";
import "../styles/dashboard.css";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const BRANDS = [
  {
    name: "CTRL",
    category: "Streetwear",
    unitsSold: 486,
    stock: 142,
    revenue: 388800,
    performance: 92,
  },
  {
    name: "KNTD",
    category: "Graphic Streetwear",
    unitsSold: 421,
    stock: 96,
    revenue: 336800,
    performance: 84,
  },
  {
    name: "27",
    category: "Youth Essentials",
    unitsSold: 362,
    stock: 118,
    revenue: 271500,
    performance: 73,
  },
  {
    name: "GAIA",
    category: "Premium Casual",
    unitsSold: 275,
    stock: 74,
    revenue: 247500,
    performance: 58,
  },
  {
    name: "Denjoe",
    category: "Women’s Fashion",
    unitsSold: 154,
    stock: 183,
    revenue: 138600,
    performance: 34,
  },
];

const STAFF = [
  {
    name: "Mariam Ahmed",
    role: "Branch Manager",
    branch: "New Cairo",
    status: "Active",
  },
  {
    name: "Youssef Ali",
    role: "Sales Associate",
    branch: "New Cairo",
    status: "Active",
  },
  {
    name: "Salma Hassan",
    role: "Branch Manager",
    branch: "Sheikh Zayed",
    status: "Active",
  },
  {
    name: "Omar Khaled",
    role: "Inventory Coordinator",
    branch: "Sheikh Zayed",
    status: "Active",
  },
  {
    name: "Noura Adel",
    role: "Branch Manager",
    branch: "Saudi Arabia",
    status: "Active",
  },
];

const BRANCHES = [
  {
    name: "New Cairo",
    location: "Park Mall",
    revenue: 624000,
    sales: 785,
    stock: 243,
    staff: 12,
    performance: 91,
  },
  {
    name: "Sheikh Zayed",
    location: "Royal Park Mall",
    revenue: 493500,
    sales: 621,
    stock: 218,
    staff: 9,
    performance: 78,
  },
  {
    name: "Saudi Arabia",
    location: "Souq 7",
    revenue: 265700,
    sales: 292,
    stock: 152,
    staff: 7,
    performance: 56,
  },
];

const INVENTORY = [
  {
    product: "Oversized Graphic T-shirt",
    brand: "CTRL",
    branch: "New Cairo",
    quantity: 48,
    status: "In stock",
  },
  {
    product: "Relaxed Denim",
    brand: "KNTD",
    branch: "Sheikh Zayed",
    quantity: 31,
    status: "In stock",
  },
  {
    product: "Youth Essential Set",
    brand: "27",
    branch: "Saudi Arabia",
    quantity: 12,
    status: "Low stock",
  },
  {
    product: "Premium Casual Shirt",
    brand: "GAIA",
    branch: "New Cairo",
    quantity: 7,
    status: "Low stock",
  },
  {
    product: "Women’s Wide-leg Pants",
    brand: "Denjoe",
    branch: "Sheikh Zayed",
    quantity: 3,
    status: "Critical",
  },
];

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "customers", label: "Customers", icon: "◎" },
  { id: "staff", label: "Staff", icon: "♙" },
  { id: "brands", label: "Brands", icon: "◆" },
  { id: "inventory", label: "Inventory", icon: "▦" },
  { id: "branches", label: "Branches", icon: "⌖" },
];

function formatMoney(value) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function MetricCard({ label, value, note }) {
  return (
    <article className="admin-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="admin-page-heading">
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <span>{description}</span>
    </div>
  );
}

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] =
    useState(true);
  const [customerError, setCustomerError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch(
          `${API_URL}/api/entries`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.errors?.[0] ||
              "Could not load customers."
          );
        }

        setCustomers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setCustomerError(
          "Customer data could not be loaded from the server."
        );
      } finally {
        setLoadingCustomers(false);
      }
    }

    loadCustomers();
  }, []);
  const loggedInUser = JSON.parse(
  localStorage.getItem("genz_user") || "{}"
);

const adminName =
  loggedInUser.name ||
  loggedInUser.user?.name ||
  "Admin User";

const adminInitials = adminName
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((word) => word[0]?.toUpperCase())
  .join("");

  const totalRevenue = BRANCHES.reduce(
    (sum, branch) => sum + branch.revenue,
    0
  );

  const totalUnits = BRANDS.reduce(
    (sum, brand) => sum + brand.unitsSold,
    0
  );

  const totalStock = BRANDS.reduce(
    (sum, brand) => sum + brand.stock,
    0
  );

  const bestBrand = useMemo(
    () =>
      [...BRANDS].sort(
        (a, b) => b.unitsSold - a.unitsSold
      )[0],
    []
  );

  const weakestBrand = useMemo(
    () =>
      [...BRANDS].sort(
        (a, b) => a.unitsSold - b.unitsSold
      )[0],
    []
  );

  function renderOverview() {
    return (
      <>
        <PageHeading
          eyebrow="Business overview"
          title="GenZ performance"
          description="A complete view of customers, brands, inventory, staff, and all branches."
        />

        <section className="admin-metrics-grid">
          <MetricCard
            label="Total revenue"
            value={formatMoney(totalRevenue)}
            note="Across all three branches"
          />

          <MetricCard
            label="Units sold"
            value={totalUnits.toLocaleString()}
            note="Across all featured brands"
          />

          <MetricCard
            label="Available stock"
            value={totalStock.toLocaleString()}
            note="Current brand-level quantity"
          />

          <MetricCard
            label="Registered users"
            value={customers.length}
            note="Accounts created through the form"
          />
        </section>

        <section className="admin-overview-grid">
          <article className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p>Brand performance</p>
                <h2>Sales by brand</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("brands")}
              >
                View all
              </button>
            </div>

            <div className="admin-brand-bars">
              {BRANDS.map((brand) => (
                <div
                  className="admin-brand-bar"
                  key={brand.name}
                >
                  <div>
                    <strong>{brand.name}</strong>
                    <span>
                      {brand.unitsSold} units
                    </span>
                  </div>

                  <div className="admin-progress-track">
                    <span
                      style={{
                        width: `${brand.performance}%`,
                      }}
                    />
                  </div>

                  <b>{brand.performance}%</b>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-panel admin-highlight-panel">
            <p>Best selling brand</p>
            <h2>{bestBrand.name}</h2>
            <strong>
              {bestBrand.unitsSold} units sold
            </strong>
            <span>
              {formatMoney(bestBrand.revenue)} revenue
            </span>

            <div className="admin-highlight-divider" />

            <p>Needs attention</p>
            <h3>{weakestBrand.name}</h3>
            <span>
              Only {weakestBrand.unitsSold} units sold
            </span>
          </article>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <p>Branch comparison</p>
              <h2>All locations</h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("branches")}
            >
              Full report
            </button>
          </div>

          <div className="admin-branch-cards">
            {BRANCHES.map((branch) => (
              <article key={branch.name}>
                <span>{branch.location}</span>
                <h3>{branch.name}</h3>

                <div>
                  <p>
                    <b>{formatMoney(branch.revenue)}</b>
                    Revenue
                  </p>

                  <p>
                    <b>{branch.sales}</b>
                    Sales
                  </p>

                  <p>
                    <b>{branch.stock}</b>
                    Stock
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderCustomers() {
    return (
      <>
        <PageHeading
          eyebrow="Customer management"
          title="Registered users"
          description="People who created an account through the GenZ registration form."
        />

        <section className="admin-panel">
          {loadingCustomers ? (
            <div className="admin-state">
              Loading customers...
            </div>
          ) : customerError ? (
            <div className="admin-error">
              {customerError}
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Birthday</th>
                    <th>Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="admin-person">
                          <span>
                            {initials(customer.name)}
                          </span>
                          <strong>
                            {customer.name}
                          </strong>
                        </div>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>
                        {formatDate(customer.birthday)}
                      </td>
                      <td>
                        {formatDate(customer.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    );
  }

  function renderStaff() {
    return (
      <>
        <PageHeading
          eyebrow="Team management"
          title="People working in GenZ"
          description="Staff members, roles, branches, and current working status."
        />

        <section className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {STAFF.map((member) => (
                  <tr key={member.name}>
                    <td>
                      <div className="admin-person">
                        <span>
                          {initials(member.name)}
                        </span>
                        <strong>{member.name}</strong>
                      </div>
                    </td>
                    <td>{member.role}</td>
                    <td>{member.branch}</td>
                    <td>
                      <span className="admin-status active">
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  function renderBrands() {
    return (
      <>
        <PageHeading
          eyebrow="Brand analytics"
          title="Local brand performance"
          description="See which labels are selling well, which need support, and how much stock remains."
        />

        <section className="admin-brand-performance-grid">
          {BRANDS.map((brand, index) => (
            <article
              className="admin-brand-performance-card"
              key={brand.name}
            >
              <div className="admin-brand-rank">
                {String(index + 1).padStart(2, "0")}
              </div>

              <span>{brand.category}</span>
              <h2>{brand.name}</h2>

              <div className="admin-brand-numbers">
                <p>
                  <b>{brand.unitsSold}</b>
                  Units sold
                </p>
                <p>
                  <b>{brand.stock}</b>
                  Quantity
                </p>
                <p>
                  <b>{formatMoney(brand.revenue)}</b>
                  Revenue
                </p>
              </div>

              <div className="admin-progress-track">
                <span
                  style={{
                    width: `${brand.performance}%`,
                  }}
                />
              </div>

              <small>
                {brand.performance >= 75
                  ? "Strong performance"
                  : brand.performance >= 50
                    ? "Average performance"
                    : "Needs attention"}
              </small>
            </article>
          ))}
        </section>
      </>
    );
  }

  function renderInventory() {
    return (
      <>
        <PageHeading
          eyebrow="Inventory control"
          title="Product quantities"
          description="Track stock quantity by product, brand, and branch."
        />

        <section className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Branch</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {INVENTORY.map((item) => (
                  <tr
                    key={`${item.product}-${item.branch}`}
                  >
                    <td>
                      <strong>{item.product}</strong>
                    </td>
                    <td>{item.brand}</td>
                    <td>{item.branch}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <span
                        className={`admin-status ${item.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  function renderBranches() {
    return (
      <>
        <PageHeading
          eyebrow="Branch analytics"
          title="All branch performance"
          description="Compare revenue, sales, inventory, staff, and performance for every GenZ location."
        />

        <section className="admin-branches-grid">
          {BRANCHES.map((branch) => (
            <article
              className="admin-branch-report"
              key={branch.name}
            >
              <span>{branch.location}</span>
              <h2>{branch.name}</h2>

              <div className="admin-branch-report-grid">
                <p>
                  <b>{formatMoney(branch.revenue)}</b>
                  Revenue
                </p>

                <p>
                  <b>{branch.sales}</b>
                  Sales
                </p>

                <p>
                  <b>{branch.stock}</b>
                  Stock
                </p>

                <p>
                  <b>{branch.staff}</b>
                  Staff
                </p>
              </div>

              <div className="admin-progress-track">
                <span
                  style={{
                    width: `${branch.performance}%`,
                  }}
                />
              </div>

              <small>
                {branch.performance}% branch performance
              </small>
            </article>
          ))}
        </section>
      </>
    );
  }

  function renderActivePage() {
    switch (activeTab) {
      case "customers":
        return renderCustomers();
      case "staff":
        return renderStaff();
      case "brands":
        return renderBrands();
      case "inventory":
        return renderInventory();
      case "branches":
        return renderBranches();
      default:
        return renderOverview();
    }
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-sidebar-logo">
          <img src="/genz-logo.png" alt="GenZ" />
        </Link>

        <div className="admin-sidebar-label">
          Management
        </div>

        <nav>
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              className={
                activeTab === item.id ? "active" : ""
              }
              onClick={() => setActiveTab(item.id)}
              key={item.id}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/">Back to website</Link>
          <p>GenZ Admin</p>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <div>
            <span>GenZ operations</span>
            <strong>
              {NAV_ITEMS.find(
                (item) => item.id === activeTab
              )?.label || "Overview"}
            </strong>
          </div>

          <div className="admin-profile">
            <span>{adminInitials || "AD"}</span>
            <div>
              <strong>{adminName}</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        <div className="admin-page">
          {renderActivePage()}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
