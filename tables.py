from sqlalchemy import String, Column
from database import Base
class Customers(Base):
    __tablename__ = "customers"
    username = Column(String, primary_key="true")
    password = Column(String)
class Employees(Base):
    __tablename__ = "employees"
    username = Column(String, primary_key="true")
    password = Column(String)
