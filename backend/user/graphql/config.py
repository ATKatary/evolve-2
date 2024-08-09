from ariadne import load_schema_from_path
from user.graphql import mutations, queries, subscriptions
from src.graphql.types import query, mutation, subscription

type_defs = [
    load_schema_from_path("user/graphql/base.graphql")
]

query.set_field("coach", queries.get_coach)
query.set_field("student", queries.get_student)

mutation.set_field("assignStudentProgram", mutations.assign_student_programs)
mutation.set_field("createStudent", mutations.create_student)
mutation.set_field("createCoach", mutations.create_coach)


