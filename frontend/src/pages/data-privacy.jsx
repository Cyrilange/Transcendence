const DataPolicy = () => { 
	return ( 
		<div className="DataPolicy"> 
			<h1>DataPolicy</h1> 
		<h2>1. Purpose</h2>	<p>
				In this section, you explain why this policy is in place and what people should expect now that it's being used. For example:
				The company must restrict access to confidential and sensitive data to protect it from being lost or compromised, since any incident could adversely impact our customers and result in penalties for non-compliance and damage to our reputation. At the same time, we must ensure that users can access data as required for them to work effectively.
				It is not anticipated that this policy can eliminate all malicious data theft. Rather, its primary objective is to increase user awareness and avoid accidental loss scenarios, so it outlines the best practices for data breach prevention.
			</p>
			<h2>2. Scope</h2>
			<h3>2.1 In Scope </h3> <p>
				In this section, you list all areas that fall under the policy, such as data sources and types. Here is a sample data protection policy "In Scope" section:
				This data security policy applies all customer data, personal data and other company data defined as sensitive by the company’s data classification policy. Therefore, it applies to every server, database and IT system that handles such data, including any device regularly used for email, web access or other work-related tasks. Every user interacting with company IT services is also subject to this policy.
			</p>

			<h3>2.2 Out of Scope </h3> <p>
				This section is where you define what is excluded from your data security policy. For instance:
				Information that is classified as Public is not subject to this policy. Other data can be excluded from the policy by company management based on specific business needs, such as that protecting the data is too costly or complex.
			</p>
			<h2>3. Policy</h2><p>
				This is the body of the policy where you state all policy requirements. Here is an example:
			</p>
			<h3>3.1 Principles</h3> <p>
				The company shall provide all employees and contracted third parties access to the information they need to carry out their responsibilities as effectively and efficiently as possible.
			</p>
			<h3>3.2 General</h3> <p>
				a. Each user shall be identified by a unique user ID so that individuals can be held accountable for their actions.

				b. The use of shared identities is permitted only where they are suitable, such as training accounts or service accounts.

				c. Each user shall read this data security policy and sign a statement that they understand the conditions of access.

				d. Records of user access may be used to provide evidence for security incident investigations.

				e. Access shall be granted based on the principle of least privilege, which means that each user, application and service will be granted the fewest privileges necessary to complete their tasks.
			</p>
			<h3>3.3 Access Control Authorization</h3> <p>
				Access to company IT resources and services will be given through a unique user account and complex password. Accounts are provided by the IT department based on HR records.

				The IT Service Desk manages passwords. Requirements for password length, complexity and expiration are stated in the company password policy.

				Role-based access control (RBAC) will be used to secure access to all file-based resources in Active Directory domains.	
			</p>
			<h3>3.4 Network Access</h3> <p>
				a. All employees and contractors shall be given network access in accordance with business access control procedures and the least-privilege principle.

				b. All staff and contractors with remote access to company networks shall be authenticated using the VPN authentication mechanism only.

				c. Segregation of networks shall be implemented as recommended by the company's network security research. Network administrators shall group information services, users and information systems as appropriate to achieve the required segregation.

				d. Network routing controls shall be implemented to support the access control policy.
			</p>
			<h3>3.5 User Responsibilities</h3> <p>
				a. All users must lock their screens whenever they leave their desks to reduce the risk of unauthorized access.

				b. All users must keep their workplace clear of any sensitive or confidential information when they leave.

				c. All users must keep their passwords confidential and not share them.
			</p>
			<h3>3.6 Application and Information Access</h3><p>
				a. All company staff and contractors shall be granted access to the data and applications required for their job responsibilities.

				b. All company staff and contractors shall access sensitive data and systems only if there is a business need to do so and they have approval from higher management.

				c. Sensitive systems shall be physically or logically isolated to restrict access to authorized personnel only.

				3.7 Access to Confidential or Restricted Information

				a. Access to data classified as ‘Confidential’ or ‘Restricted’ shall be limited to authorized persons whose job responsibilities require it, as determined by the Data Security Policy or higher management.

				b. The responsibility to implement access restrictions lies with the IT Security department.
			</p>
			<h2>4. Technical Guidelines</h2> <p>
			The technical guidelines in your data protection policy template should specify all requirements for technical controls used to grant access to data. Here is an example:

			Access control methods to be used shall include:

				Auditing of attempts to log on to any device on the company network
				Windows NTFS permissions to files and folders
				Role-based access model
				Server access rights
				Firewall permissions
				Network zone and VLAN ACLs
				Web authentication rights
				Database access rights and ACLs
				Encryption at rest and in flight
				Network segregation

			Access control applies to all networks, servers, workstations, laptops, mobile devices, web applications, websites, cloud storage and services.
			</p>
			<h2>5. Reporting Requirements</h2> <p> 
				This section describes the requirements for reporting any incidents that occur. All employees should be required to learn how to report incidents.

				a. Daily incident reports shall be produced by the IT Security department or the Incident Response Team.

				b. The IT Security department shall produce weekly reports detailing all incidents and send them to the IT manager or director.

				c. High-priority incidents discovered by the IT Security department shall be immediately escalated to the IT manager.

				d. The IT Security department shall also produce a monthly report showing the number of IT security incidents and the percentage that were resolved.
			</p>
			<h2>6. Ownership and Responsibilities</h2> <p>
			Here, you should state who owns what and who is responsible for which actions and controls. Here are some common roles:

				Data owners are employees who have primary responsibility for maintaining information that they own, such as an executive, department manager or team leader.
				Information Security Administrator is an employee designated by IT management who provides administrative support for implementing, overseeing and coordinating security procedures and systems concerning specific information resources.
				Users include everyone with access to information resources, such as employees, trustees, contractors, consultants, temporary employees and volunteers.
				The Incident Response Team shall be chaired by an executive and include employees from departments such as IT Infrastructure, IT Application Security, Legal, Financial Services and Human Resources.
			</p>
			<h2>7. Enforcement</h2> <p>
			This paragraph should clearly state the penalties for access control violations so there is no room for misunderstandings. For example:

			Any user found in violation of this policy is subject to disciplinary action, up to and including termination of employment. Any third-party partner or contractor found in violation may have their network connection terminated.
			</p>
			<h2>8. Definitions</h2> <p>
				This paragraph defines any technical terms used in the policy so that readers will know exactly what is meant. Here are some examples:

				Access control list (ACL): A list of access control entries (ACEs). Each ACE in an ACL identifies a trustee and specifies the access rights allowed, denied or audited for that trustee.
				Database: An organized collection of data, generally stored and accessed electronically from a computer system.
				Encryption: The process of encoding a message or other information so that only authorized parties can access it.
				Firewall: A technology used for isolating one network from another. Firewalls can be standalone or included in other devices, such as routers or servers.
				Network segregation: The separation of the network into logical or functional units called zones. Segregation helps prevent threat actors from moving laterally through the network.
				Role-based access control (RBAC): A model for granting privileges based on a user’s job functions.
				Server: A computer program or device that provides functionality for other programs or devices, called clients.
				Virtual private network (VPN): A secure private network connection across a public network.
				VLAN (virtual LAN): A logical grouping of devices in the same broadcast domain.

			</p>
			<h2>9. Related Documents</h2><p>
				This section lists all documents related to the policy and provides links to them. This list might include links to the following information:

				Data Classification Policy
				Password Policy
				Data Loss Protection Policy
				Encryption Policy
				Incident Response Policy
				Workstation Security Policy
				Data Processing Agreement
			</p>
			
			

			
		</div> 
	) 
} 

export default DataPolicy;