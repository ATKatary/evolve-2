from user.graphql.config import type_defs as user_type_defs
from program.graphql.config import type_defs as program_type_defs

from src.graphql.types import query, mutation, subscription
from ariadne_django.scalars import date_scalar, datetime_scalar
from ariadne import make_executable_schema, load_schema_from_path, snake_case_fallback_resolvers

type_defs = [
    *user_type_defs, 
    *program_type_defs, 

    load_schema_from_path("src/graphql/queries.graphql"),
    load_schema_from_path("src/graphql/mutations.graphql"),
    load_schema_from_path("src/graphql/subscriptions.graphql")
]

schema = make_executable_schema(
    type_defs, 
    date_scalar,
    datetime_scalar,

    query, 
    mutation,
    subscription,

    snake_case_fallback_resolvers
)
