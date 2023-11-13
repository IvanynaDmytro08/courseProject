import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ShoppingListService} from "../../shopping-list/shopping-list.service";

@Component({
  selector: 'app-recipe-detai',
  templateUrl: './recipe-detai.component.html',
  styleUrls: ['./recipe-detai.component.css']
})
export class RecipeDetaiComponent implements OnInit{

 recipe: Recipe;
 id: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router,
             ) {
  }

  ngOnInit() {
  this.route.params.subscribe(
    (params:Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id)
    }
  )
  }

  onAddToShoppingList() {

    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.router.navigate(['/shopping-list'], {relativeTo: this.route})

  }

  onEditRecipe(){
    // this.router.navigate(['edit'], {relativeTo: this.route}) // легший шлях
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route}) // більш складніщий шлях
  }

    onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipe'], )

    }

}
