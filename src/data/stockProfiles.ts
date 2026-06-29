export interface StockProfile {
  symbol: string;
  name: string;
  sector: string;
  marketCapRank: string;
  overview: string;
  businessSegments: string;
  fundamentalAnalysis: string;
  risksAndOpportunities: string;
}

export const STOCK_PROFILES: Record<string, StockProfile> = {
  "RELIANCE": {
    symbol: "RELIANCE",
    name: "Reliance Industries Limited",
    sector: "Conglomerate (Energy, Retail, Telecom)",
    marketCapRank: "Large Cap",
    overview: "Reliance Industries Limited (RIL) is India's largest and most profitable private sector company. Founded by Dhirubhai Ambani, the company has transformed from a textile and polyester company into a massive conglomerate spanning energy, petrochemicals, retail, telecommunications, and digital services. Headquartered in Mumbai, RIL consistently ranks among the top companies in the Nifty 50 index and carries significant weight in the Indian stock market. Its performance is often viewed as a barometer for the broader Indian economy.",
    businessSegments: "RIL operates through three major pillars: 1. Oil to Chemicals (O2C): This legacy business remains a massive cash cow, operating the world's largest and most complex single-site refinery in Jamnagar, Gujarat. 2. Jio Platforms: The digital and telecom arm that revolutionized Indian internet access with dirt-cheap 4G and 5G data, boasting hundreds of millions of subscribers. 3. Reliance Retail: India's largest retailer by revenue, scale, and profit, operating thousands of stores across electronics, grocery, and fashion segments.",
    fundamentalAnalysis: "When analyzing Reliance Industries, investors often look at a 'Sum of the Parts' (SOTP) valuation because its businesses are so diverse. A high PE ratio for RIL is often justified by the hyper-growth of its Jio and Retail arms, even if the traditional O2C business faces cyclical headwinds. The company has also made aggressive moves into green energy, pledging massive investments to become net carbon zero, which heavily influences its long-term fundamental outlook.",
    risksAndOpportunities: "The biggest opportunity for Reliance lies in its digital ecosystem (Jio) and consumer retail dominance, alongside its pivot to new energy (solar, green hydrogen). However, risks include massive capital expenditure (CapEx) requirements, high debt levels historically required for expansion, and vulnerability to global crude oil price fluctuations affecting its refining margins."
  },
  "TCS": {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "Information Technology",
    marketCapRank: "Large Cap",
    overview: "Tata Consultancy Services (TCS) is the flagship company of the Tata Group and India's largest IT services company by market capitalization and revenue. Founded in 1968, TCS is a global leader in IT services, consulting, and business solutions. It boasts a massive global workforce and serves clients across banking, retail, manufacturing, and healthcare sectors. TCS is renowned for its high corporate governance standards, consistent dividend payouts, and stability, making it a cornerstone stock for many Indian mutual funds and retail portfolios.",
    businessSegments: "TCS generates revenue primarily through IT consulting, application development, infrastructure support, and business process outsourcing (BPO). Its key geographical market is North America, followed by the UK and Europe. The Banking, Financial Services, and Insurance (BFSI) sector contributes the largest chunk to its top line. In recent years, TCS has heavily focused on digital transformation services, cloud migration, AI integration, and cybersecurity.",
    fundamentalAnalysis: "TCS is structurally a high-margin, cash-rich business with virtually zero debt. Its Return on Equity (ROE) and Return on Capital Employed (ROCE) are historically among the best in the Nifty 50. Investors closely track its 'Operating Margins' and 'Attrition Rate' during quarterly earnings. A high PE ratio for TCS reflects the market's premium for its earnings visibility, management pedigree, and strong free cash flow generation.",
    risksAndOpportunities: "The primary growth driver for TCS is the global shift toward cloud computing and Artificial Intelligence (GenAI). However, its biggest risks are macroeconomic. Since it earns predominantly in USD and EUR, it is vulnerable to currency fluctuations (INR/USD exchange rate). Furthermore, an economic recession in the US or Europe directly impacts client IT budgets, potentially slowing down TCS's revenue growth."
  },
  "HDFCBANK": {
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    sector: "Banking & Financial Services",
    marketCapRank: "Large Cap",
    overview: "HDFC Bank is India's largest private sector bank by assets and market capitalization. Following its historic merger with its parent company, Housing Development Finance Corporation (HDFC Ltd), it became one of the largest banks globally. Known for its pristine asset quality, robust technology infrastructure, and aggressive branch expansion, HDFC Bank is a heavyweight in both the Nifty 50 and Bank Nifty indices. It serves tens of millions of customers with wholesale banking, retail banking, and treasury operations.",
    businessSegments: "The bank operates primarily across three segments: 1. Retail Banking: Serving individual customers with savings accounts, credit cards, auto loans, and personal loans. HDFC Bank is the market leader in credit cards in India. 2. Wholesale Banking: Providing corporate loans, trade finance, and cash management to large enterprises and SMEs. 3. Treasury: Managing the bank's investment portfolio and statutory reserves.",
    fundamentalAnalysis: "Key metrics for HDFC Bank include the Net Interest Margin (NIM), which indicates profitability, and the Gross/Net Non-Performing Assets (GNPA/NNPA) ratios, which indicate asset quality. Historically, HDFC Bank commands a premium valuation (Price-to-Book ratio) compared to public sector banks because of its low NPAs and consistent 15-20% year-on-year profit growth. Post-merger, analysts closely monitor its Credit-Deposit (CD) ratio as the bank aggressively raises deposits to fund loan growth.",
    risksAndOpportunities: "The merger with HDFC Ltd gives the bank a massive portfolio of home loans, creating cross-selling opportunities to millions of mortgage customers. However, the sheer size of the merged entity makes maintaining historical growth rates challenging (the 'base effect'). Risks include rising interest rates leading to margin compression, and intense competition for retail deposits from other private and public sector banks."
  },
  "INFY": {
    symbol: "INFY",
    name: "Infosys Limited",
    sector: "Information Technology",
    marketCapRank: "Large Cap",
    overview: "Infosys is India's second-largest IT services company and a global pioneer in digital consulting and technology services. Founded in 1981 by N.R. Narayana Murthy and six other engineers in Pune, Infosys is widely credited with putting India on the global IT map. It was the first Indian company to list on the NASDAQ. Today, Infosys helps global enterprises navigate their digital transformation, operating with a vast global workforce and state-of-the-art training facilities in Mysore.",
    businessSegments: "Like TCS, Infosys generates the bulk of its revenue from North America and Europe. Its key verticals include Financial Services, Retail, Communications, Energy, and Manufacturing. Infosys offers core IT services, business process management, and proprietary platforms like Finacle (a dominant core banking software used globally) and EdgeVerve.",
    fundamentalAnalysis: "Infosys is celebrated for its capital allocation policy, frequently rewarding shareholders with dividends and share buybacks. When analyzing INFY, investors look at its Total Contract Value (TCV) of large deal wins as an indicator of future revenue. Operating margins and employee utilization rates are critical profitability metrics. The stock typically trades at a slight discount to TCS, reflecting historical differences in margin stability.",
    risksAndOpportunities: "Infosys is heavily investing in Generative AI, launching platforms like 'Topaz' to capture the AI boom. The risks are similar to the broader Indian IT sector: dependence on US and European economic health, H-1B visa regulatory challenges in the US, and intense wage inflation and attrition during tech boom cycles. Any slowdown in discretionary tech spending by Western corporations directly hits its bottom line."
  },
  "ICICIBANK": {
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    sector: "Banking & Financial Services",
    marketCapRank: "Large Cap",
    overview: "ICICI Bank is India's second-largest private sector bank, offering a diversified portfolio of financial products and services. Over the past decade, ICICI Bank has undergone a massive transformation, successfully cleaning up its corporate loan book and pivoting aggressively towards retail banking and digital initiatives. Under its recent leadership, the bank has consistently delivered industry-leading growth and profitability, making it a favorite among institutional investors and a core holding in the Bank Nifty index.",
    businessSegments: "The bank operates through an extensive network of branches and ATMs across India. Its core segments include Retail Banking (home loans, personal loans, credit cards), Corporate Banking, and International Banking. Additionally, ICICI Bank has highly profitable subsidiaries in life insurance (ICICI Prudential), general insurance (ICICI Lombard), and asset management (ICICI AMC), contributing significantly to its consolidated valuation.",
    fundamentalAnalysis: "ICICI Bank's turnaround story is visible in its Net Interest Margin (NIM) expansion and drastic reduction in Non-Performing Assets (NPAs). Investors look at its Return on Assets (ROA) and Return on Equity (ROE), both of which have seen massive improvements. When valuing the stock, analysts use the 'Sum of the Parts' (SOTP) method to value the core banking business and add the value of its listed subsidiaries.",
    risksAndOpportunities: "The bank's aggressive push into digital banking (iMobile Pay app) and pre-approved loan analytics provides a massive opportunity to capture retail market share efficiently. Risks include potential macroeconomic slowdowns leading to retail loan defaults (unsecured loans/credit cards), and stringent regulatory changes by the Reserve Bank of India (RBI) regarding capital requirements or lending practices."
  },
  "ZOMATO": {
    symbol: "ZOMATO",
    name: "Zomato Limited",
    sector: "Consumer Tech / Food Delivery",
    marketCapRank: "Large Cap",
    overview: "Zomato is a pioneering Indian multinational restaurant aggregator and food delivery company. Founded by Deepinder Goyal and Pankaj Chaddah in 2008, Zomato has revolutionized how Indians dine out and order food. It is one of the most heavily searched and debated stocks among retail investors, given its massive brand visibility, high growth trajectory, and journey towards consistent profitability after its highly anticipated IPO.",
    businessSegments: "Zomato's revenue primarily comes from three segments: 1. Food Delivery: Its core business, connecting millions of users with local restaurants and charging delivery fees/commissions. 2. Blinkit: Its ultra-fast quick commerce arm delivering groceries in 10 minutes, which has become a massive growth engine. 3. Hyperpure: A B2B platform supplying fresh, high-quality ingredients directly to restaurant partners.",
    fundamentalAnalysis: "Valuing new-age tech companies like Zomato requires looking beyond traditional Price-to-Earnings (PE) ratios. Analysts focus heavily on Gross Order Value (GOV), Monthly Transacting Users (MTUs), and Contribution Margin. The turnaround in its profitability and the explosive growth of Blinkit are the primary catalysts that investors track when determining if the stock justifies its high valuation multiples.",
    risksAndOpportunities: "The biggest opportunity is the vast, underpenetrated Indian food delivery and quick commerce market. However, Zomato faces intense duopoly competition from Swiggy (and Zepto in quick commerce). Regulatory risks regarding gig-worker wages and aggressive cash burn in new verticals (like live events/ticketing) remain key concerns for long-term holders."
  },
  "SUZLON": {
    symbol: "SUZLON",
    name: "Suzlon Energy Limited",
    sector: "Renewable Energy / Wind Power",
    marketCapRank: "Mid Cap",
    overview: "Suzlon Energy is a prominent Indian renewable energy solutions provider, primarily focused on wind turbine manufacturing. Once a market darling in the late 2000s, the company went through a massive debt crisis that decimated retail wealth. However, in recent years, Suzlon has staged a remarkable turnaround, deleveraging its balance sheet and riding the massive tailwinds of India's green energy push, making it one of the most traded and discussed momentum stocks in the market.",
    businessSegments: "Suzlon's operations are divided into: 1. Wind Turbine Generator (WTG) Manufacturing: Designing and producing wind turbines. 2. Operations and Maintenance Services (OMS): A highly profitable recurring revenue stream managing and servicing installed turbines globally. 3. Foundry & Forging components.",
    fundamentalAnalysis: "For Suzlon, the most critical fundamental metric has been Debt Reduction. After significant restructuring and rights issues, the company has drastically reduced its debt-to-equity ratio. Investors now look at its Order Book size and EBITDA margins. Since it is a turnaround story, its valuation often trades on forward-looking optimism regarding government renewable energy targets rather than trailing historical earnings.",
    risksAndOpportunities: "India's ambitious target of achieving 500 GW of non-fossil fuel capacity by 2030 provides a massive structural opportunity for Suzlon. The primary risks include intense competition in the renewable space, supply chain disruptions affecting turbine manufacturing, and any potential policy shifts or delays in state government power procurement."
  },
  "IRFC": {
    symbol: "IRFC",
    name: "Indian Railway Finance Corporation",
    sector: "Public Sector Undertaking (Finance)",
    marketCapRank: "Large Cap",
    overview: "Indian Railway Finance Corporation (IRFC) is the dedicated funding arm of Indian Railways. It is a Schedule 'A' Miniratna Public Sector Enterprise. IRFC's primary mandate is to raise financial resources from domestic and overseas capital markets to fund the massive infrastructure and rolling stock expansion of Indian Railways. It has recently been one of the biggest multibagger stocks in the PSU space, capturing massive retail interest.",
    businessSegments: "IRFC operates with a unique, zero-NPA business model. It raises funds at very competitive rates and leases rolling stock (locomotives, passenger coaches, freight wagons) to the Ministry of Railways. Because its sole client is the sovereign Government of India, the credit risk is practically zero. It also funds railway infrastructure projects.",
    fundamentalAnalysis: "IRFC is unique because its operating expenses are incredibly low, and it operates on a 'cost-plus' margin model agreed upon with the Ministry of Railways. Investors love IRFC for its extremely safe loan book (0% NPAs), consistent dividend yield, and solid Return on Equity (ROE). A key metric is its spread (the difference between its borrowing cost and lending rate).",
    risksAndOpportunities: "The opportunity lies in the Indian government's massive, multi-year capital expenditure (CapEx) push to modernize the railway network (Vande Bharat trains, station redevelopment). The main risk is that IRFC's margins are capped by the government, meaning it cannot suddenly increase its profitability exponentially. Furthermore, any future privatization or changes in how Indian Railways sources its funding could alter IRFC's monopoly."
  },
  "IREDA": {
    symbol: "IREDA",
    name: "Indian Renewable Energy Development Agency",
    sector: "Public Sector Undertaking (Finance)",
    marketCapRank: "Mid Cap",
    overview: "IREDA is a Mini Ratna government enterprise operating as a Non-Banking Financial Institution (NBFC) under the Ministry of New and Renewable Energy. It provides financial assistance and loans exclusively for renewable energy and energy efficiency projects. Since its highly successful IPO, IREDA has been constantly in the news as a pure-play proxy to India's booming green energy transition.",
    businessSegments: "IREDA finances all types of renewable projects: Solar, Wind, Hydro, Biomass, and emerging sectors like Green Hydrogen and Battery Energy Storage Systems (BESS). It lends to independent power producers, state utilities, and equipment manufacturers, effectively acting as the financial backbone of India's green transition.",
    fundamentalAnalysis: "When analyzing IREDA, key NBFC metrics apply: Net Interest Margin (NIM), Loan Book Growth, and Asset Quality (Gross and Net NPAs). Because it lends to infrastructure projects, managing NPAs is critical. Investors are willing to pay a premium valuation for IREDA compared to traditional PSU banks because of its hyper-growth loan book and the government's total backing of the renewable sector.",
    risksAndOpportunities: "The opportunity is vast: financing the multi-trillion rupee transition to green energy in India. The risks involve project execution delays by the companies it lends to, which could lead to an uptick in Non-Performing Assets. Additionally, as a pure-play renewable financier, it lacks the diversified loan book of traditional banks, concentrating its risk in a single sector."
  },
  "JIOFIN": {
    symbol: "JIOFIN",
    name: "Jio Financial Services Limited",
    sector: "Non-Banking Financial Company (NBFC)",
    marketCapRank: "Large Cap",
    overview: "Jio Financial Services (JFS) is a highly anticipated financial services company that was demerged from Reliance Industries. Backed by the immense capital and digital ecosystem of the Reliance Group, JFS aims to disrupt the Indian financial services market. It is one of the most widely held and discussed stocks, as retail investors bet on it becoming the 'next Bajaj Finance' by leveraging the massive user base of Reliance Retail and Jio Telecom.",
    businessSegments: "JFS is building a massive financial conglomerate. Its planned operations include: 1. Consumer and Merchant Lending (leveraging Reliance Retail data). 2. Payment Solutions (JioPay, Jio Voice box). 3. Asset Management (in a joint venture with BlackRock to disrupt the Indian mutual fund industry). 4. Insurance Broking.",
    fundamentalAnalysis: "Analyzing JFS is currently based on its 'optionality' and the massive cash/investments on its balance sheet (primarily its stake in Reliance Industries). Traditional metrics like PE ratio or NIM are currently less relevant because the company is in a massive build-out phase. Investors value JFS based on the execution capability of its management and the sheer scale of the addressable market it can tap into through the Reliance ecosystem.",
    risksAndOpportunities: "The opportunity is unparalleled: cross-selling financial products to over 400 million Jio subscribers and millions of Reliance Retail shoppers. However, the financial sector is highly regulated and fiercely competitive (facing giants like Bajaj Finance, Paytm, and traditional banks). The primary risk is execution risk—building a profitable lending book requires entirely different expertise than building a telecom network."
  }
};

// Fallback generator for stocks not in the predefined list
export const getGenericProfile = (symbol: string): StockProfile => ({
  symbol: symbol.toUpperCase(),
  name: `${symbol.toUpperCase()} Ltd`,
  sector: "Public Equities",
  marketCapRank: "Listed Company",
  overview: `${symbol.toUpperCase()} is a publicly traded company listed on the Indian stock exchanges (NSE/BSE). As a participant in the Indian capital markets, its stock price is driven by quarterly earnings performance, sector-specific tailwinds, macroeconomic factors, and broader market sentiment. Investors tracking ${symbol} should closely monitor official corporate filings, annual reports, and guidance provided by the management team.`,
  businessSegments: `The company operates within its specific industry sector, generating revenue through its core products and services. Its market position is determined by its competitive advantages, market share, and operational efficiency compared to peers in the same industry.`,
  fundamentalAnalysis: `When analyzing ${symbol}, fundamental investors should evaluate key financial metrics such as the Price-to-Earnings (PE) ratio, Earnings Per Share (EPS) growth, Return on Equity (ROE), and Debt-to-Equity ratio. Comparing these metrics against industry averages provides insight into whether the stock is undervalued or overvalued by the current market.`,
  risksAndOpportunities: `Like all equities, investing in ${symbol} carries inherent market risks, including regulatory changes, economic slowdowns, and intense sector competition. However, strong management execution, capacity expansion, and favorable industry trends can present significant opportunities for long-term wealth creation. Always use a strict stop-loss and maintain portfolio diversification.`
});
